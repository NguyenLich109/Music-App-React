import axios from "axios";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [indexSong, setIndexSong] = useState(1);
  const [music, setMusic] = useState({});
  const [boolean, setBoolean] = useState(false);
  const [checkPlay, setCheckPlay] = useState(false);
  const [timePlay, setTimePlay] = useState(0);
  const [checkRepest, setCheckRepest] = useState(false);
  const [booleanRepest, setBooleanRepest] = useState(false);
  const [volume, setVolume] = useState(100);

  const getAudio = useRef();

  useEffect(() => {
    axios
      .get(
        "https://mp3.zing.vn/xhr/chart-realtime?songId=0&videoId=0&albumId=0&chart=song&time=-1"
      )
      .then((res) => {
        setSongs(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:3000/listSong")
  //     .then((res) => {
  //       setSongs(res.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  useEffect(() => {
    const findSong = songs?.song?.find((song) => song.position === indexSong);
    setMusic(findSong);
  }, [indexSong, songs, booleanRepest]);

  useEffect(() => {
    if (checkPlay) {
      getAudio.current?.play();
    } else {
      getAudio.current?.pause();
    }
  }, [getAudio, checkPlay, music, booleanRepest]);

  const handleEnded = (id) => {
    if (checkRepest) {
      setBooleanRepest(!booleanRepest);
      setIndexSong(id);
    } else {
      if (id === songs.length) {
        getAudio.current?.pause();
        setCheckPlay(false);
      } else {
        setIndexSong(id + 1);
      }
    }
  };
  const handleChane = (value) => {
    getAudio.current.currentTime = Number(
      Math.floor((value / 100) * getAudio.current?.duration)
    );
    setTimePlay(Number(Math.floor((value / 100) * getAudio.current?.duration)));
  };
  const handleRepeat = () => {
    setCheckRepest(!checkRepest);
  };
  const handleVolum = (value) => {
    setVolume(value);
    getAudio.current.volume = value / 100;
  };
  return (
    <>
      <div class="wrapper">
        <div class="top-bar">
          <i class="material-icons">expand_more</i>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <span>{music?.name}</span>
            <span style={{ fontSize: "14px" }}>{music?.artists_names}</span>
          </div>
          <i class="material-icons">more_horiz</i>
        </div>
        <div class="img-area">
          <img src={music?.thumbnail} alt=""></img>
        </div>
        <div class="song-details">
          <p class="name"></p>
          <p class="artist"></p>
        </div>
        <div class="progress-area">
          <div class="progress-bar">
            <input
              id="progress"
              class="progress"
              type="range"
              value={
                getAudio.current?.duration.toString() === "NaN"
                  ? "0"
                  : (timePlay / getAudio.current?.duration) * 100
              }
              step="1"
              min="0"
              max="100"
              onChange={(e) => handleChane(e.target.value)}
            ></input>
            <audio
              ref={getAudio}
              onEnded={() => {
                handleEnded(music?.position);
              }}
              onTimeUpdate={() => {
                setTimePlay(Math.floor(getAudio.current?.currentTime));
              }}
              // onVolumeChange={() => {
              // }}
              id="main-audio"
              src={`http://api.mp3.zing.vn/api/streaming/audio/${music?.id}/320`}
            ></audio>
          </div>
          <div class="song-timer">
            <span class="current-time" style={{ width: "15%" }}>
              {timePlay > 60
                ? `${Math.floor(timePlay / 60)}:${timePlay % 60}`
                : timePlay > 9
                ? `0:${timePlay}`
                : `0:0${timePlay}`}
            </span>
            <div
              style={{ width: "50%", display: "flex", alignItems: "center" }}
            >
              <i class="material-icons color">volume_up</i>
              <input
                style={{ height: "5px" }}
                id="progress"
                class="progress"
                type="range"
                value={volume}
                step="1"
                min="0"
                max="100"
                onChange={(e) => handleVolum(e.target.value)}
              ></input>
            </div>
            <span
              class="max-duration"
              style={{ width: "15%", textAlign: "right" }}
            >
              {`${Math.floor(music?.duration / 60)}:${music?.duration % 60}`}
            </span>
          </div>
        </div>
        <div class="controls">
          <i
            id="repeat-plist"
            className={`material-icons ${checkRepest ? "active" : ""}`}
            title="Playlist looped"
            onClick={handleRepeat}
          >
            repeat
          </i>
          <i
            id="prev"
            class="material-icons"
            onClick={() => {
              if (music?.position === 1) {
                setIndexSong(songs?.song.length);
              } else {
                setIndexSong(music?.position - 1);
              }
            }}
          >
            skip_previous
          </i>
          <div
            class="play-pause"
            onClick={() => {
              setCheckPlay(!checkPlay);
            }}
          >
            {checkPlay ? (
              <i class="material-icons play">pause</i>
            ) : (
              <i class="material-icons play">play_arrow</i>
            )}
          </div>
          <i
            id="next"
            class="material-icons"
            onClick={() => {
              if (music?.position === songs?.song.length) {
                setIndexSong(1);
              } else {
                setIndexSong(music?.position + 1);
              }
            }}
          >
            skip_next
          </i>
          <i
            id="more-music"
            class="material-icons"
            onClick={() => setBoolean(true)}
          >
            queue_music
          </i>
        </div>
        <div
          class="music-list"
          style={boolean ? { display: "block" } : { display: "none" }}
        >
          <div class="header">
            <div class="row">
              <i class="list material-icons">queue_music</i>
              <span>Music list</span>
            </div>
            <i
              id="close"
              class="material-icons"
              onClick={() => setBoolean(false)}
            >
              close
            </i>
          </div>
          <ul>
            {songs?.song?.map((song, index) => {
              return (
                <li
                  key={index}
                  onClick={() => {
                    setIndexSong(song?.position);
                    setBoolean(false);
                    setCheckPlay(true);
                  }}
                >
                  <div style={{ width: "20%" }}>
                    <img
                      src={song?.thumbnail}
                      style={{ width: "40px", height: "40px" }}
                    ></img>
                  </div>
                  <div class="row" style={{ width: "70%" }}>
                    <span>{song?.name}</span>
                    <p>{song.artists_names}</p>
                  </div>
                  <div style={{ width: "10%" }}>
                    <span class="audio-duration">
                      {`${Math.floor(song?.duration / 60)}:${
                        song?.duration % 60
                      }`}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
