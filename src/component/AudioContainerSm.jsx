import React, {useState, useEffect, useRef, useLayoutEffect} from 'react'
import { CgNotes } from 'react-icons/Cg';

const AudioContainerSm = (props) => {

    const {
        oneAudioFromArray,
        setImg,
        idx,
        handleGranularPlayback, 
        currentPlayState,
        setCurrentPlayState,
        setDangerousHTML,
        audioObjectArray,
        masterAudio,
        handleTimeUpdate} = props;

    const [oneTitle, setOneTitle] = useState("");

    const [bg, setBg] = useState({ backgroundColor: "#939393", color: "#414141" });

    const generateTitle = () => {
        if (oneAudioFromArray.title.length > 50) {
            setOneTitle(oneAudioFromArray.title.substring(0, 51)+" ...")
        } else {
            setOneTitle(oneAudioFromArray.title)
        }
    }
    useEffect(() => {
        generateTitle();
    },[])

    const updateImg = (link) => {
        setImg(link);
    }

    const showInfoHandler = (e, index) => {
        e.stopPropagation();
        if (currentPlayState.summaryIdx === index) {
            setCurrentPlayState({ ...currentPlayState, isSummaryShowing: !currentPlayState.isSummaryShowing });
            
        } else {
            setCurrentPlayState({ ...currentPlayState, isSummaryShowing: true, summaryIdx: index });
        }
        setDangerousHTML({__html: audioObjectArray[index].summary})
    }

    return (
        <>
            <div
                onClick={() => { updateImg(oneAudioFromArray.image.href), handleGranularPlayback(idx, oneAudioFromArray) }}
                className="bg-mines-800 text-neutral-300 flex gap-2 items-center justify-between px-8 py-4 hover:cursor-pointer hover:bg-mines-400 hover:text-mines-800"
                style={currentPlayState.idx === idx ? bg : null}>
                <p className='tracking-normal font-medium'> {oneTitle}</p>
                <CgNotes onClick={(e) => showInfoHandler(e, idx)} className="hover:scale-[150%]" />
                <audio ref={masterAudio} onTimeUpdate={handleTimeUpdate} />
            </div>
        </>
    )
}

export default AudioContainerSm