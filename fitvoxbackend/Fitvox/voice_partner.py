from numpy.lib.npyio import save
import torch
from scipy.io.wavfile import write
import numpy as np
import os


class VoicePartner:

    # Use Singleton to prevent repetitive loading of pretrained weights
    __instance = None
    savepath = "Audio/"
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

        # make directory to save to voice files
        if not os.path.exists(self.savepath):
            os.makedirs(self.savepath)

        # load assist audio files
        self.start_voice_partner = np.load("Audio/Assist/start_voice_partner.npy")
        self.start_exercise = np.load("Audio/Assist/start_exercise.npy")
        self.start_set = np.load("Audio/Assist/start_set.npy")
        self.number_audio = []
        for i in range(0, 10):
            self.number_audio.append(np.load("Audio/Assist/Numbers/" + str(i+1) + ".npy"))
        self.start_breaktime = np.load("Audio/Assist/start_breaktime.npy")
        self.end_breaktime = np.load("Audio/Assist/end_breaktime.npy")
        self.last_announce = np.load("Audio/Assist/last_announce.npy")

    def forward(self, text):
        sequences, lengths = self.utils.prepare_input_sequence([text])
        with torch.no_grad():
            mel, _, _ = self.tts.infer(sequences, lengths)
            audio = self.vocoder.infer(mel)
        return audio[0].data.cpu().numpy()

    def make_wavs(self, entry_list, username):
        rate = 22050
        wav_list = []
        entry_audio = self.start_voice_partner
        info_list = []
        zeros = np.zeros(rate)

        save_path = self.savepath + username
        if not os.path.exists(save_path):
            os.makedirs(save_path)

        for (idx1, entry) in enumerate(entry_list):
            entry_audio = np.append(np.zeros(int(rate / 2)), entry_audio)
            entry_audio = np.append(entry_audio, self.start_exercise)
            entry_audio = np.append(entry_audio, self.forward(" " + entry['name'] + " "))

            for (idx2, each_set) in enumerate(entry['sets']):
                entry_audio = np.append(entry_audio, zeros)
                entry_audio = np.append(entry_audio, self.start_set)
                entry_audio = np.append(entry_audio, np.zeros(10))
                set_num = int(each_set['set_num'])
                if set_num < 11:
                    entry_audio = np.append(entry_audio, self.number_audio[set_num-1])
                else:
                    entry_audio = np.append(entry_audio, self.forward(" " + each_set['set_num'] + " "))
                entry_audio = np.append(entry_audio, zeros)

                for rep in range(each_set['repetition']):
                    if rep < 10:
                        entry_audio = np.append(entry_audio, self.number_audio[rep])
                    else:
                        entry_audio = np.append(entry_audio, self.forward(" " + str(rep + 1) + " "))
                    entry_audio = np.append(entry_audio, zeros)

                if idx1 != len(entry_list)-1 or idx2 != len(entry['sets'])-1:
                    entry_audio = np.append(entry_audio, self.start_breaktime)
                    entry_audio = np.append(entry_audio, self.forward(" " + str(each_set['breaktime']) + " " + " seconds "))
                wav_list.append(entry_audio)
                info_list.append(f"Set{each_set['set_num']} of {entry['name']}")
                entry_audio = np.array([])

                # For last entry
                if idx1 == len(entry_list)-1 and idx2 == len(entry['sets'])-1:
                    last_announce = np.append(zeros, self.last_announce)
                    wav_list.append(np.append(last_announce, zeros))
                    info_list.append("Ending Voice Partner")
                    break

                # For Breaktime
                breaktime = np.array([])
                if each_set['breaktime'] > 10:
                    breaktime = np.zeros(rate * (each_set['breaktime'] - 10))

                for sec in range(min(10, each_set['breaktime']), 0, -1):
                    breaktime = np.append(breaktime, self.number_audio[sec-1])
                    breaktime = np.append(breaktime, np.zeros(9096))
                wav_list.append(breaktime)
                entry_audio = np.append(entry_audio, self.end_breaktime)
                entry_audio = np.append(entry_audio, np.zeros(rate))

                info_list.append("Break Time")

        url_list = []
        for idx, wav in enumerate(wav_list):
            url = f"{save_path}/{idx}.wav"
            write(url, rate, wav.astype(np.float32))
            url_dict = {'id': idx, 'url': f'{self.django_url}/{idx}/', 'message': info_list[idx]}
            url_list.append(url_dict)

        return url_list


'''
if __name__ == '__main__':
    voice_partner = VoicePartner.get_instance()
    save_path = 'Audio/Assist/'
    start_voice_partner = voice_partner.forward("   Starting  Voice  Partner  ")
    np.save(save_path+"start_voice_partner", start_voice_partner)

    start_exercise = voice_partner.forward("  Starting Exercise  ")
    np.save(save_path+"start_exercise", start_exercise)

    start_set = voice_partner.forward("  Starting Set   ")
    np.save(save_path+"start_set", start_set)


    for num in range(1, 11):
        number = voice_partner.forward("     " + str(num) + "     ")
        np.save(save_path + "Numbers/" + str(num), number)
 

    start_breaktime = voice_partner.forward("  Starting Break time for  ")
    np.save(save_path+"start_breaktime", start_breaktime)

    end_breaktime = voice_partner.forward("  Breaktime  over   ")
    np.save(save_path+"end_breaktime", end_breaktime)

    last_announce = voice_partner.forward(" Workout Done! Ending Voice Partner ")
    np.save(save_path+"last_announce", last_announce)

    end_breaktime = voice_partner.forward("  Breaktime  is   over     ")
    np.save(save_path + "end_breaktime", end_breaktime)

    one = voice_partner.forward("    1    ")
    np.save(save_path+"Numbers/1.npy", one)
'''