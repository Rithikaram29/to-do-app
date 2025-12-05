import React, { useEffect } from 'react';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { openVoiceModal } from '../../store/uiSlice';
import { parseVoiceLocally } from '../../utils/voiceParser';
import type { VoiceParsedTask } from '../../types/task';
import { useAppDispatch } from '../../hooks/useRedux';

const VoiceInput: React.FC = () => {
  const { listening, transcript, error, start, stop, setTranscript } =
    useSpeechToText();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!listening && transcript) {
      // When recording stops and we have text, parse it
      const parsed: VoiceParsedTask = parseVoiceLocally(transcript);  
      console.log("locally_parsed_value:", parsed)     //TODO replace with ai
      dispatch(openVoiceModal(parsed));
      setTranscript('');
    }
  }, [listening, transcript, dispatch, setTranscript]);

  return (
    <div className="voice-input">
      <button
        type="button"
        onClick={() => (listening ? stop() : start())}
        className={`mic-button ${listening ? 'active' : ''}`}
      >
        {listening ? 'Stop' : 'Speak'}
      </button>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default VoiceInput;