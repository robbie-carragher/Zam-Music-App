
import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs } from "../components";

import { setActiveSong, playPause } from "../redux/features/playerSlice";
import {
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
} from "../redux/services/shazamCore";

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const {
    data: relatedSongsData,
    isFetching: isFetchingRelatedSongs,
    error: relatedSongsError,
  } = useGetSongRelatedQuery({ songid });

  const {
    data: songData,
    isFetching: isFetchingSongDetails,
    error: songDetailsError,
  } = useGetSongDetailsQuery({ songid });

  // Handle loading state
  if (isFetchingSongDetails || isFetchingRelatedSongs) {
    return <Loader title="Searching song details" />;
  }

  // Handle errors
  if (songDetailsError || relatedSongsError) {
    return <Error />;
  }

  // Extract lyrics if available
  const lyricsSection = songData?.sections?.find(
    (section) => section.type === "LYRICS"
  );

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: relatedSongsData, i }));
    dispatch(playPause(true));
  };

  return (
    <div className="flex flex-col">
      <DetailsHeader
        artistId={songData?.artists?.[0]?.adamid}
        songData={songData}
      />

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Lyrics:</h2>
        <div className="mt-5">
          {lyricsSection ? (
            lyricsSection.text.map((line, i) => (
              <p
                key={`lyrics-${line}-${i}`}
                className="text-gray-400 text-base my-1"
              >
                {line}
              </p>
            ))
          ) : (
            <p className="text-gray-400 text-base my-1">
              Sorry, No lyrics found!
            </p>
          )}
        </div>
      </div>

      <RelatedSongs
        data={relatedSongsData}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseClick={handlePauseClick}
        handlePlayClick={handlePlayClick}
      />
    </div>
  );
};

export default SongDetails;
