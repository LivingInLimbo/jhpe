import { useEffect, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

type props = {
  imgSrcs: string[];
  defaultImage?: JSX.Element;
};

export const ImageCarousel = ({
  imgSrcs,
  defaultImage = (
    <div className="flex w-full h-full items-center justify-center">
      No Images
    </div>
  ),
}: props) => {
  const [selectedImage, setSelectedImage] = useState(imgSrcs[0]);

  useEffect(() => {
    setSelectedImage(imgSrcs[0]);
  }, [imgSrcs]);

  const backImage = () => {
    let index = imgSrcs.findIndex((imgSrc) => imgSrc == selectedImage);
    if (index == -1) {
      index = 0;
    }
    let newIndex = index - 1;
    if (newIndex < 0) {
      newIndex = imgSrcs.length - 1;
    }
    setSelectedImage(imgSrcs[newIndex]);
  };

  const forwardImage = () => {
    let index = imgSrcs.findIndex((imgSrc) => imgSrc == selectedImage);
    if (index == -1) {
      index = 0;
    }
    let newIndex = index + 1;
    if (newIndex > imgSrcs.length - 1) {
      newIndex = 0;
    }
    setSelectedImage(imgSrcs[newIndex]);
  };

  const arrowClass =
    "absolute text-center w-auto h-auto border border-gray-500 rounded-full p-2 cursor-pointer bg-white bg-opacity-80";

  return (
    <div className="flex relative flex-col w-full select-none">
      <div className="flex relative w-full justify-center rounded-t-md h-[80vh] overflow-hidden">
        {imgSrcs.length == 0 && defaultImage}
        {imgSrcs.length > 0 && (
          <>
            <div className="flex h-full w-0 items-center">
              <div onClick={backImage} className={`${arrowClass} left-0 ml-2`}>
                <IoChevronBack />
              </div>
            </div>
            <img className="object-contain" src={selectedImage}></img>
            <div className="flex h-full w-0 items-center">
              <div
                onClick={forwardImage}
                className={`${arrowClass} right-0 mr-2`}
              >
                <IoChevronForward />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="absolute bottom-2 flex w-full flex-wrap justify-center gap-2 mt-4">
        {imgSrcs.map((imgSrc) => {
          return (
            <img
              key={imgSrc}
              onClick={() => setSelectedImage(imgSrc)}
              className={`w-14 h-14 ${
                imgSrc != selectedImage ? "opacity-40" : "shadow-md"
              } border cursor-pointer rounded-md object-cover overflow-hidden`}
              src={imgSrc}
            ></img>
          );
        })}
      </div>
    </div>
  );
};
