import ReactPlayer from "react-player";
import { Swiper, SwiperSlide } from "swiper/react";

import { IGame } from "../../types/GameTypes";
import { Box } from "@mui/material";

export interface IPropsGameOverViewSwiper {
  game: IGame;
  currentImageIndex: number;
  setSrc: (_: string) => void;
  setType: (_: string) => void;
  setCurrentImageIndex: (_: number) => void;
}

const GameOverViewSwiper = ({ game, currentImageIndex, setSrc, setType, setCurrentImageIndex }: IPropsGameOverViewSwiper) => {
  return (
    <Swiper spaceBetween={15} slidesPerView={"auto"} loop={false}>
      {game?.projectMeta?.gallery?.map((item, index) => (
        <SwiperSlide style={{ width: "150px" }}>
          {item.type === "image" && (
            <img
              key={`${index}`}
              src={item.src}
              width={`150px`}
              height={`120px`}
              onClick={() => {
                setSrc(item.src);
                setType(item.type);
                setCurrentImageIndex(index);
              }}
              style={{
                transition: "all 0.3s ease",
                cursor: "pointer",
                opacity: currentImageIndex === index ? 1 : 0.7,
                border: currentImageIndex === index ? "2px solid #52e1f2" : "none",
                borderRadius: "16px",
              }}
            />
          )}
          {item.type === "youtube" && (
            <Box
              onClick={() => {
                setSrc(item.src);
                setType(item.type);
                setCurrentImageIndex(index);
              }}
              sx={{
                width: "150px",
                height: "120px",
                transition: "all 0.3s ease",
                cursor: "pointer",
                opacity: currentImageIndex === index ? 1 : 0.7,
                border: currentImageIndex === index ? "2px solid #52e1f2" : "none",
                borderRadius: "16px",
              }}
            >
              <ReactPlayer className="react-player" url={item.src} width={"150px"} height={"120px"} controls />
            </Box>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default GameOverViewSwiper;