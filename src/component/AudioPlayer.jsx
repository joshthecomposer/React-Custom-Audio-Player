import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import axios from 'axios'
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa'
import { IoClose } from 'react-icons/io'
import {BsFillSkipEndFill, BsFillSkipStartFill} from 'react-icons/bs'
import AudioContainerSm from './AudioContainerSm'

const AudioPlayer = (props) => {
    const [currentTime, setCurrentTime] = useState(0);
    const { audioObjectArray, currentPlayState, setCurrentPlayState, img, setImg, masterAudio, dangerousHTML, setDangerousHTML } = props;

    //This allows the user to play/pause and select other tracks within the tracklist
    const handleGranularPlayback = (index, oneAudio) => { //TODO: REFACTOR THIS FUNCTION.
        if (currentPlayState.isPlaying) {
            if (currentPlayState.idx === index) {
                masterAudio.current.pause();
                setCurrentPlayState({ ...currentPlayState, isPlaying: false });
            } else {
                masterAudio.current.pause();
                masterAudio.current = new Audio(oneAudio.links[0].href);
                setCurrentPlayState({ ...currentPlayState, idx: index, summaryIdx:index });
                masterAudio.current.play();
            }
        } else {
            if (currentPlayState.idx === index) {
                setCurrentPlayState({ ...currentPlayState, isPlaying: true });
                masterAudio.current.play();
            } else {
                masterAudio.current.pause();
                masterAudio.current = new Audio(oneAudio.links[0].href);
                setCurrentPlayState({ ...currentPlayState, idx: index, isPlaying: true, summaryIdx:index });
                masterAudio.current.play();
            }
        }
        if (!currentPlayState.isInit) {
            masterAudio.current.pause();
            masterAudio.current = new Audio(oneAudio.links[0].href);
            setCurrentPlayState({ ...currentPlayState,isPlaying:true, isInit: true, idx:index, summaryIdx:index });
            masterAudio.current.play();
        }
    }
    //TODO: REFACTOR BOTH PLAYBACK FUNCTIONS TO BE MORE CONCISE AND HANDLE EVERYTING IN ONE FUNCTION.
    const handleMasterPlayback = () => {
        if (!currentPlayState.isInit) {
            setCurrentPlayState({ ...currentPlayState, idx: 0, isInit: true, isPlaying:true });
            masterAudio.current = new Audio(audioObjectArray[0].links[0].href) //TODO: Check if this can ref oneAudio
            masterAudio.current.play();
        } else {
            if (currentPlayState.isPlaying) {
                masterAudio.current.pause();
                setCurrentPlayState({...currentPlayState, isPlaying:false})
            } else {
                masterAudio.current.play();
                setCurrentPlayState({...currentPlayState, isPlaying:true})
            }
        }
    }

    const handleSkip = (input) => {
        if (!currentPlayState.isInit) {
            handleMasterPlayback();
            return;
        }
        if ((currentPlayState.idx + input) > (audioObjectArray.length - 1)) {
            masterAudio.current.pause();
            setCurrentPlayState({ ...currentPlayState, idx: 0, isPlaying: true })
            masterAudio.current = new Audio(audioObjectArray[0].links[0].href)
            masterAudio.current.play();
            return;
        } else if ((currentPlayState.idx + input) < 0) {
            masterAudio.current.pause();
            setCurrentPlayState({ ...currentPlayState, idx: audioObjectArray.length-1, isPlaying: true })
            masterAudio.current = new Audio(audioObjectArray[audioObjectArray.length-1].links[0].href)
            masterAudio.current.play();
            return
        }
        masterAudio.current.pause();
        setCurrentPlayState({ ...currentPlayState, idx: currentPlayState.idx + input, isPlaying: true });
        masterAudio.current = new Audio(audioObjectArray[currentPlayState.idx+input].links[0].href)
        masterAudio.current.play();
    }

    const handleSeek = (e) => {
        masterAudio.current.currentTime = e.target.value;
        setCurrentTime(masterAudio.current.currentTime);
    }

    const handleTimeUpdate = (e) => {
        setCurrentTime(masterAudio.current.currentTime);
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(masterAudio.current.currentTime);
        }, 100);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className='flex items-center flex-col w-full xl:w-1/2 md:w-2/3 bg-mines-900 relative rounded-lg overflow-hidden shadow-lg'>
            <div className='flex w-full h-[250px] relative'>
                <img src={img} className='w-[250px]' alt="" />
                <div className="flex flex-col w-full">
                    <div className="w-full h-3/4 flex justify-center items-center gap-10">
                        <BsFillSkipStartFill
                            className="text-neutral-200 hover:cursor-pointer hover:text-white"
                            onClick={() => handleSkip(-1)}
                            size="50px" />
                        {
                            currentPlayState.isPlaying ?
                                <FaPauseCircle
                                    onClick={handleMasterPlayback}
                                    size="100px"
                                    className='text-neutral-200 hover:cursor-pointer hover:text-white' />
                                :
                                <FaPlayCircle
                                    onClick={handleMasterPlayback}
                                    size="100px"
                                    className="text-neutral-200 hover:cursor-pointer hover:text-white" />
                        }
                        <BsFillSkipEndFill
                            className="text-neutral-200 hover:cursor-pointer hover:text-white"
                            onClick={() => handleSkip(1)}
                            size="50px" />
                    </div>
                    <div className="slidercontainer static">
                        <input className="slider absolute" type="range" min="0" value={currentTime} max={masterAudio.current.duration} onChange={handleSeek} />
                    </div>
                </div>
            </div>
            <div
                className='flex flex-col w-full'
                style={{flexDirection:currentPlayState.isSummaryShowing ? "row" : "column"}}>
                    <div
                    dangerouslySetInnerHTML={currentPlayState.isSummaryShowing ? dangerousHTML : null}
                    className="px-20 py-20 w-full top-0 tracking-normal text-2xl max-h-[50rem] overflow-x-hidden"
                    style={{ width: currentPlayState.isSummaryShowing ? "50%" : "100%", display: currentPlayState.isSummaryShowing ? "block" : "none" }}>
                </div>
                <div
                    className="w-full flex flex-col bg-mines-900 overflow-x-hidden overflow-y-scroll max-h-[50rem]"
                    style={{width:currentPlayState.isSummaryShowing ? "50%" : "100%"}}>
                    {
                        audioObjectArray.map((a, i) => (
                            <div key={i}>
                                <AudioContainerSm setImg={setImg} handleGranularPlayback={handleGranularPlayback} masterAudio={masterAudio} oneAudioFromArray={a} idx={i} currentPlayState={currentPlayState} setCurrentPlayState={setCurrentPlayState} setDangerousHTML={setDangerousHTML} audioObjectArray={ audioObjectArray } handleTimeUpdate={handleTimeUpdate} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default AudioPlayer