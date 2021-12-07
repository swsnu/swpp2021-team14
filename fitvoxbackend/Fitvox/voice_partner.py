import torch
from scipy.io.wavfile import write
import numpy as np


class VoicePartner:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        # Use Tactron2 for TTS
        tacotron2 = torch.hub.load('nvidia/DeepLearningExamples', 'nvidia_tacotron2')
        self.tts = tacotron2.to(self.device).eval()
        self.text_to_sequence = tacotron2.text_to_sequence

        # Use waveglow for vocoder
        waveglow = torch.hub.load('NVIDIA/DeepLearningExamples:torchhub', 'nvidia_waveglow', model_math='fp16')
        waveglow = waveglow.remove_weightnorm(waveglow)
        self.vocoder = waveglow.to(self.device).eval()

    def forward(self, text):
        sequence = np.array(self.text_to_sequence(text, ['english_cleaners']))[None, :]
        with torch.no_grad():
            _, mel, _, _ = self.tts.infer(sequence)
            audio = self.vocoder.infer(mel)
        audio_numpy = audio[0].data.cpu().numpy()
        rate = 22050
        write("Audios/22050_1000.wav", rate, audio_numpy)


if __name__ == '__main__':
    voicePartner = VoicePartner()
    blank = "\n"*100
    text = "1"+blank+"2"+blank+"3"+blank+"4"+blank+"5"

    voicePartner.forward(text)
