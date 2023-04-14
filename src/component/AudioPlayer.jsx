import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import axios from 'axios'
import { FaPlayCircle, FaPauseCircle } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import {BsFillSkipEndFill, BsFillSkipStartFill} from 'react-icons/bs'
import AudioContainerSm from './AudioContainerSm'

const AudioPlayer = (props) => {
    const [currentTime, setCurrentTime] = useState(0);
    const { audioObjectArray, currentPlayState, setCurrentPlayState, img, setImg, masterAudio, dangerousHTML, setDangerousHTML } = props;
    const [currentSeconds, setCurrentSeconds] = useState(0);
    const [currentMinutes, setCurrentMinutes] = useState(0);
    const [currentHours, setCurrentHours] = useState(0);

    const [currentMaxSeconds, setCurrentMaxSeconds] = useState(0);
    const [currentMaxMinutes, setCurrentMaxMinutes] = useState(0);
    const [currentMaxHours, setCurrentMaxHours] = useState(0);

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
            setCurrentHours(Math.floor(currentTime/3600));
            setCurrentMinutes(Math.floor((currentTime%3600)/60));
            setCurrentSeconds(Math.floor(currentTime % 60));
        }, 100);
        return () => clearInterval(intervalId);
    }, [currentTime]);

    useEffect(() => {
        setCurrentMaxSeconds(Math.floor(masterAudio.current.duration % 60));
        setCurrentMaxMinutes(Math.floor((masterAudio.current.duration %3600) / 60));
        setCurrentMaxHours(Math.floor(masterAudio.current.duration/3600))
    },[currentTime])

    const hideInfoHandler = () => {
        setCurrentPlayState({...currentPlayState, isSummaryShowing : false})
    }

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
                    <div className="flex flex-col">
                        <input className="slider" type="range" min="0" value={currentTime} max={!masterAudio.current.duration ? 0 : masterAudio.current.duration} onChange={handleSeek} />
                        <div className="flex justify-between px-2">
                            <p className="font-ozzy font-normal text-[1.8rem] tracking-wider">
                                {
                                    currentHours < 10 ? <span>0{currentHours}</span> : <span>{currentHours}</span>
                                }
                                :
                                {
                                    currentMinutes < 10 ? <span>0{currentMinutes}</span> : <span>{currentMinutes}</span>
                                }
                                :
                                {
                                    currentSeconds < 10 ? <span>0{currentSeconds}</span> : <span>{currentSeconds}</span>
                                }
                            </p>
                            <p className="font-ozzy font-normal text-[1.8rem] tracking-wider">
                                {
                                    !currentMaxHours ? <span>00</span> :
                                    currentMaxHours < 10 ? <span>0{currentMaxHours}</span> : <span>{currentMaxHours}</span>
                                }
                                :
                                {
                                    !currentMaxMinutes ? <span>00</span>:
                                    currentMaxMinutes < 10 ? <span>0{currentMaxMinutes}</span> : <span>{currentMaxMinutes}</span>
                                }
                                :
                                {
                                    !currentMaxSeconds ? <span>00</span> :
                                    currentMaxSeconds < 10 ? <span>0{currentMaxSeconds}</span> : <span>{currentMaxSeconds}</span>
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className='flex flex-col w-full'
                style={{flexDirection:currentPlayState.isSummaryShowing ? "row" : "column"}}>
                <div
                    className="flex relative flex-row px-20 py-20 w-full top-0 tracking-normal text-2xl max-h-[50rem] overflow-x-hidden"
                    style={{ width: currentPlayState.isSummaryShowing ? "50%" : "100%", display: currentPlayState.isSummaryShowing ? "block" : "none" }}>
                    <div className="static" dangerouslySetInnerHTML={currentPlayState.isSummaryShowing ? dangerousHTML : null}></div>
                    <IoMdClose className="absolute top-0 right-0 text-neutral-200 w-[25px] h-[25px] hover:cursor-pointer" onClick={hideInfoHandler} />
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