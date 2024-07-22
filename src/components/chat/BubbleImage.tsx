import { useState } from "react";

import { Box } from "@mui/material";

import { ChatMessageType } from "../../types/chatTypes";
import BubbleImageModal from "./BubbleImageModal";

const IMAGE_URL = "https://dev.tymt.com/public/upload/room-image/66855e3d70fe2851827b7ccb.jpg";

export interface IParamsBubbleImage {
  message: ChatMessageType;
  decryptedMessage: string;
  isLastMessage: boolean;
  isSender: boolean;
  roomMode: boolean;
}

const BubbleImage = ({ roomMode, message, isLastMessage, isSender }: IParamsBubbleImage) => {
  const [_showTime, setShowTime] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setShowTime(true);
  };

  const handleMouseLeave = () => {
    setShowTime(false);
  };

  const handleClick = () => {
    setShowImageModal(true);
  };

  return (
    <>
      <Box
        className={`fs-14-regular white bubble-image ${isLastMessage ? (roomMode ? "br-20-20-20-0" : isSender ? "br-20-20-0-20" : "br-20-20-20-0") : "br-20"}`}
        sx={{ position: "relative" }}
      >
        <Box
          component={"img"}
          src={IMAGE_URL}
          width={"200px"}
          height={"150px"}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
        <Box
          className="fs-16-regular white"
          sx={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            padding: "4px",
            borderRadius: "10px",
            height: "20px",
            backgroundColor: "#00000088",
          }}
        >
          {new Date(message.createdAt).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Box>
      </Box>

      <BubbleImageModal open={showImageModal} setOpen={setShowImageModal} url={IMAGE_URL} />
    </>
  );
};

export default BubbleImage;