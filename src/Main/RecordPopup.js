import React, { useEffect, useState } from 'react';
import useRecorder from "./Recorder";
import './RecordPopup.css'

function RecordPopup({setRecord, setRecordMenu}) {
  const [showButtons, setShowButtons] = useState({showRecord: true, showPause: false, showBin: false, showSend: false});
  
	const [submitAudio, setSubmitAudio] = useState(false);
	let [audioURL, isRecording, startRecording, stopRecording] = useRecorder();
	
	const handleClick = (e) => {
    if(e.target.name === "record"){
      startRecording();
			setShowButtons({...showButtons, showRecord: false, showPause: true});
    } else if(e.target.name === "pause"){
      stopRecording();
			setShowButtons({...showButtons, showPause: false, showBin: true, showSend: true});
    } else if(e.target.name === "send"){
      stopRecording();
			setSubmitAudio(true);
    } else if(e.target.name === "delete"){
      stopRecording();
      setRecord("");
		  setRecordMenu(false);
    }
  }

	useEffect(() => {
		if(submitAudio) {	
		  setRecord(audioURL);
		  setRecordMenu(false);
		}
	}, [submitAudio, audioURL]);
	
  return(
    <div className="record">
      {showButtons.showRecord && <button type="button" alt="" name="record" onClick={handleClick} disabled={isRecording} class="btn btn-outline-secondary btn-sm"><i class="bi bi-mic"></i></button>}
      {showButtons.showSend && <button type="button" alt="" name="send" onClick={handleClick} class="btn btn-outline-secondary btn-sm"><i class="bi bi-arrow-right"></i></button>}
			{showButtons.showBin && <button type="button" alt="" name="delete" onClick={handleClick} class="btn btn-outline-secondary btn-sm"><i class="bi bi-trash"></i></button>}
			{showButtons.showPause && <button type="button" alt="" name="pause" onClick={handleClick} disabled={!isRecording} class="btn btn-outline-secondary btn-sm"><i class="bi bi-pause-fill"></i></button>}
      <audio src={audioURL} controls />
    </div>
  )
}


export default RecordPopup;