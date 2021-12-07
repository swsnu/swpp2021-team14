import torch
from scipy.io.wavfile import write
import numpy as np
from datetime import datetime


class VoicePartner:

    # Use Singleton to prevent repetitive loading of pretrained weights
    __instance = None
    savepath = "/data/VoicePartner"
    django_url = "/api/wav_file"

    @classmethod
    def get_instance(cls):
        if cls.__instance is None:
            cls.instance()
        return cls.__instance

    @classmethod
    def instance(cls):
        cls.__instance = cls()

    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        # Use Tactron2 for TTS
        tacotron2 = torch.hub.load('NVIDIA/DeepLearningExamples:torchhub', 'nvidia_tacotron2', model_math='fp16')
        self.tts = tacotron2.to(self.device).eval()

        # Use waveglow for vocoder
        waveglow = torch.hub.load('NVIDIA/DeepLearningExamples:torchhub', 'nvidia_waveglow', model_math='fp16')
        waveglow = waveglow.remove_weightnorm(waveglow)
        self.vocoder = waveglow.to(self.device).eval()

        # Utilty Methods
        self.utils = torch.hub.load('NVIDIA/DeepLearningExamples:torchhub', 'nvidia_tts_utils')

    def forward(self, text):
        sequences, lengths = self.utils.prepare_input_sequence([text])
        with torch.no_grad():
            mel, _, _ = self.tts.infer(sequences, lengths)
            audio = self.vocoder.infer(mel)
        return audio[0].data.cpu().numpy()

    def make_wavs(self, entry_list):
        rate = 22050
        wav_list = []
        entry_audio = self.forward("Starting Voice Partner ")
        breaktime_list = []

        for (idx1, entry) in enumerate(entry_list):
            entry_audio = np.append(np.zeros(int(rate / 2)), entry_audio)
            entry_audio = np.append(entry_audio, self.forward("Starting Exercise " + entry['name'] + " "))

            for (idx2, each_set) in enumerate(entry['sets']):
                entry_audio = np.append(entry_audio, np.zeros(rate))
                text = "Starting Set " + str(each_set['set_num']) + "   "
                entry_audio = np.append(entry_audio, self.forward(text))
                entry_audio = np.append(entry_audio, np.zeros(rate))

                for rep in range(each_set['repetition']):
                    entry_audio = np.append(entry_audio, self.forward(" " + str(rep + 1) + " "))
                    entry_audio = np.append(entry_audio, np.zeros(int(rate)))
                if idx1 != len(entry_list)-1 and idx2 != len(entry['sets'])-1:
                    entry_audio = np.append(entry_audio, self.forward(" Starting Break Time for " + str(each_set['breaktime']) + " " + " seconds "))
                wav_list.append(entry_audio)
                entry_audio = np.array([])

                # For last entry
                if idx1 == len(entry_list)-1 and idx2 == len(entry['sets'])-1:
                    last_announce = np.append(np.zeros(rate), self.forward(" Workout Done! Ending Voice Partner "))
                    wav_list.append(np.append(last_announce, np.zeros(rate)))
                    break

                # For Breaktime
                breaktime_list.append(each_set['breaktime'])
                breaktime = np.array([])
                if each_set['breaktime'] > 10:
                    breaktime = np.zeros(rate * (each_set['breaktime'] - 10))

                for sec in range(min(10, each_set['breaktime']), 0, -1):
                    breaktime = np.append(breaktime, self.forward(" " + str(sec) + " "))
                    breaktime = np.append(breaktime, np.zeros(9096))
                breaktime = np.append(breaktime, self.forward("Break time Done"))
                breaktime = np.append(breaktime, np.zeros(rate))

                wav_list.append(breaktime)

        url_list = []
        for idx, wav in enumerate(wav_list):
            url = f"{self.savepath}/{idx}.wav"
            write(url, rate, wav)
            if idx % 2 == 1 and idx != len(wav_list)-1:
                curr_breaktime = breaktime_list[int((idx-1)/2)]
            else:
                curr_breaktime = -1
            url_dict = {'id': idx, 'url': f'{self.django_url}/{idx}/', 'breaktime': curr_breaktime}
            url_list.append(url_dict)

        return url_list


if __name__ == '__main__':
    voicePartner = VoicePartner.get_instance()

    list_to_build = [{'name': ' Dead Lift ', 'sets': [{'set_num': 1, 'repetition': 5, 'breaktime': 15}, {'set_num': 2, 'repetition': 5, 'breaktime': 15}]}]

    url_list = voicePartner.make_wavs(list_to_build)
    print(url_list)

    print(datetime.now())
    url_list = voicePartner.make_wavs(list_to_build)
    print(datetime.now())

    '''
    rate = 22050

    wav_list = []
    entry_audio = voicePartner.forward("Starting Voice Partner ")
    for entry in list_to_build:
        entry_audio = np.append(np.zeros(int(rate/2)), entry_audio)
        entry_audio = np.append(entry_audio, voicePartner.forward("Starting Exercise " + entry['name']))

        for each_set in entry['sets']:
            entry_audio = np.append(entry_audio, np.zeros(rate))
            text = "Starting Set " + str(each_set['set_num']) + "   "
            entry_audio = np.append(entry_audio, voicePartner.forward(text))
            entry_audio = np.append(entry_audio, np.zeros(rate))

            for rep in range(each_set['repetition']):
                entry_audio = np.append(entry_audio, voicePartner.forward(" " + str(rep+1) + " "))
                entry_audio = np.append(entry_audio, np.zeros(int(rate)))
            entry_audio = np.append(entry_audio, voicePartner.forward(" Starting Break Time for " + str(each_set['breaktime']) + " " + " seconds "))
            wav_list.append(entry_audio)
            entry_audio = np.array([])

            # For Breaktime
            breaktime = np.array([])
            if(each_set['breaktime']>10):
                breaktime = np.zeros(rate * (each_set['breaktime']-10))

            for sec in range(min(10, each_set['breaktime']), 0, -1):
                breaktime = np.append(breaktime, voicePartner.forward(" "+ str(sec)+ " "))
                breaktime = np.append(breaktime, np.zeros(9096))
            breaktime = np.append(breaktime, voicePartner.forward("Break time Done"))
            breaktime = np.append(breaktime, np.zeros(rate))

            wav_list.append(breaktime)

    for idx, wav in enumerate(wav_list):
        write(f"Audios/test{idx}.wav", rate, wav)
    '''
