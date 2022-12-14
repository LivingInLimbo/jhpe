import React, { useState, useEffect, FormEvent } from "react";
import { useQuery, useLazyQuery, gql } from "@apollo/client";
import { optionsNoAuth } from "../..";
import { useErrorHandler } from "react-error-boundary";
import { Spinner } from "../app/Spinner";
import { LabledTextInput } from "../forms/LabledTextInput";
import { LabledSelect } from "../forms/LabledSelect";
import { ColorButton } from "../forms/ColorButton";
import { IoAdd, IoTrash } from "react-icons/io5";
import { ImageCarousel } from "./ImageCarousel";
import Compressor from "compressorjs";
import { useCookies } from "react-cookie";
import { GET_CATEGORIES, GET_SINGLE_LISTING } from "../../helpers/gqlQueries";
import { Category, SubCategory } from "../../helpers/gqlTypes";
import { Listing } from "../../helpers/gqlTypes";
import { useNavigate, useParams } from "react-router";
import { homeUrl } from "../../config";
import { IoTrashOutline } from "react-icons/io5";

export const CreateListingComponent = ({ listing }: { listing?: Listing }) => {
  let navigate = useNavigate();
  let subcategories: SubCategory[] = [];

  const categoryQuery = useQuery(GET_CATEGORIES);
  useErrorHandler(categoryQuery.error);
  if (categoryQuery.data) {
    subcategories = categoryQuery.data.categories[0].subcategory;
  }

  const CreateListingInternalComponent = ({
    categories,
  }: {
    categories: Category[];
  }) => {
    const [cookies, setCookie] = useCookies();
    const submitForm = (e: any) => {
      console.log("lmfao");
      e.preventDefault();
      const formData = new FormData();
      images.forEach((image: createListingImage) => {
        if (image.file) {
          formData.append("images[]", image.file);
        }
      });
      images.forEach((image: createListingImage) => {
        if (image.id) {
          formData.append("imageIds[]", `${image.id}`);
        }
      });
      formData.append("title", title);
      formData.append("price", `${price.split(/,|\$/).join("")}`);
      formData.append("isGold", `${isGold}`);
      formData.append("description", description);
      formData.append("categoryId", `${category.id}`);
      formData.append("subCategoryId", `${subCategory.id}`);
      if (listing) {
        formData.append("id", `${listing.id}`);
      }
      fetch(listing ? "/editListing" : "/createListing", {
        method: "POST",
        headers: {
          authorization: `Bearer ${cookies.userInfo}`,
        },
        body: formData,
      })
        .then((res) => {
          navigate("/account");
        })
        .catch((err) => console.log(err));
    };

    const [title, setTitle] = useState(listing ? listing.title : "");
    const [description, setDescription] = useState(
      listing ? listing.description : ""
    );
    const [price, setPrice] = useState(
      listing ? `$${listing.price.toLocaleString()}` : ""
    );
    const [isGold, setIsGold] = useState(listing ? listing.isGold : false);

    let listingCategory =
      categories.find(
        (category: Category) => category.id == listing?.category.id
      ) || categories[0];

    const [category, setCategory] = useState(listingCategory);
    const [subCategory, setSubCategory] = useState(
      listingCategory.subcategory.find(
        (sc) => sc.id == listing?.subcategory.id
      ) || listingCategory.subcategory[0]
    );

    const [errorMessage, setErrorMessage] = useState("");

    const onNameChange = (e: any) => {
      setTitle(e.target.value);
    };

    const onGoldChange = (e: any) => {
      setIsGold(e.target.checked);
    };

    const onDescriptionChange = (e: any) => {
      setDescription(e.target.value);
    };

    const onPriceChange = (e: any) => {
      const value = e.target.value;
      if (value.length == 0 || value == "$") {
        // if entire field deleted or only $ left
        setPrice("");
      } else {
        const pureNumber = value.split(/,|\$/).join("");
        if (parseInt(pureNumber)) {
          let newValue = `$${parseInt(pureNumber).toLocaleString()}`;
          setPrice(newValue);
        }
      }
    };

    const onCategoryChange = (e: any) => {
      const value = parseInt(e.target.value);
      const selectedCategory = categories.find(
        (category: Category) => category.id === value
      );
      if (selectedCategory) {
        subcategories = selectedCategory.subcategory;
      }
    };

    type createListingImage = {
      id: number | null;
      file: Blob | null;
      src: string;
    };
    const [images, setImages] = useState<createListingImage[]>(
      listing
        ? listing.images.map((image: { id: number; name: string }) => {
            return {
              id: image.id,
              src: `${homeUrl}/uploads/${image.name}`,
              file: null,
            };
          })
        : []
    );

    const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const fileRegex = new RegExp("image/*");
        const image = fileRegex.test(e.target.files[0].type);
        // check if file is indeed an image
        if (!image) {
          setErrorMessage(
            "File is not an image! Accepted formats: jpg, jpeg, png, webp"
          );
          return;
        } else if (e.target.files[0].size > 5000000) {
          setErrorMessage("File is too big! (Max. file size 5MB)");
          return;
        } else {
          setErrorMessage("");

          const handleFileChosen = (file: File): Promise<Blob> => {
            return new Promise((resolve, reject) => {
              const compressedFile = new Compressor(file, {
                quality: 0.8,
                success(res) {
                  resolve(res);
                },
                error(err) {
                  reject(err);
                },
              });
            });
          };

          const files: Blob[] = await Promise.all(
            Array.from(e.target.files).map(async (file: File) => {
              const fileContents = await handleFileChosen(file);
              return fileContents;
            })
          );

          const uploadedImages = files.map((file) => {
            return { id: null, file, src: URL.createObjectURL(file) };
          });

          setImages([...images, ...uploadedImages]);
        }
      }
    };

    const removeImage = (removeImage: createListingImage) => {
      const removeIdx = images.findIndex((image) => image === removeImage);
      if (removeIdx > -1) {
        let newImageArray = images.slice();
        newImageArray.splice(removeIdx, 1);
        setImages(newImageArray);
      }
    };

    const createListingImageClass =
      "absolute top-0 w-full h-full z-1 flex items-center justify-center border border-transparent text-red-600 cursor-pointer rounded-md opacity-0 transition-all duration-100 hover:opacity-100 hover:border-red-600";

    return categoryQuery.loading ? (
      <Spinner />
    ) : (
      <div className="flex flex-col gap-8 md:flex-row w-full">
        <div className="flex flex-col w-full items-center md:w-1/3">
          <div className="w-32 h-32 border border-gray-500 rounded-md mb-4">
            <label className="w-full h-full rounded-md cursor-pointer">
              <input
                className="hidden"
                type="file"
                multiple
                accept="image/*"
                onChange={onSelectFile}
              />
              <div className="w-full h-full flex items-center justify-center">
                <IoAdd className="" size={26} />
              </div>
            </label>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {images.map((image: createListingImage) => (
              <div key={image.src} className="relative">
                <div
                  onClick={() => removeImage(image)}
                  className={createListingImageClass}
                >
                  <IoTrashOutline size={30} />
                </div>
                <img
                  className="w-14 h-14 object-contain border rounded-md"
                  src={image.src}
                ></img>
              </div>
            ))}
          </div>

          <form className="w-full" onSubmit={submitForm}>
            {cookies.isGold == "true" && (
              <input
                type="checkbox"
                name="gold"
                onChange={onGoldChange}
              ></input>
            )}
            <LabledTextInput
              label="Title"
              placeholder="Title"
              onChange={onNameChange}
              value={title}
            />
            <LabledTextInput
              label="Price"
              charLimit={12}
              placeholder="Price"
              onChange={onPriceChange}
              value={price}
            />
            <LabledTextInput
              label="Description"
              placeholder="Description"
              charLimit={200}
              onChange={onDescriptionChange}
              textArea={true}
              value={description}
            />
            <div
              className={`text-right font-light -mt-4 mr-1 ${
                description.length >= 200 ? "text-red-600" : ""
              }`}
            >
              {description.length + "/200"}
            </div>
            <LabledSelect
              onChange={onCategoryChange}
              list={categories}
              nameId="name"
              valueId="id"
              label="Category"
            />
            <LabledSelect
              list={subcategories}
              nameId="name"
              valueId="id"
              label="Sub Category"
            />
            <ColorButton
              className="self-center"
              label="Create Listing"
              type="green"
              buttonType="submit"
            />
          </form>
        </div>
        <div className="flex flex-col w-full lg:flex-row p-4 border-t md:border-l md:border-t-0 border-gray-400">
          <div className="lg:w-full mb-4">
            <ImageCarousel
              imgSrcs={images.map((image: createListingImage) => image.src)}
              defaultImage={
                <div className="flex w-full h-full justify-center items-center text-gray-400 text-3xl">
                  No Images
                </div>
              }
            />
          </div>
          <div className="lg:w-[400px] p-8 ">
            <div className="font-light text-gray-500 mb-2">
              {category.name + " > " + subCategory.name}
            </div>
            <div
              className={`text-2xl font-medium text-left mb-1 w-full overflow-hidden text-ellipsis ${
                !title && "text-gray-500"
              }`}
            >
              {title ? title : "Title"}
            </div>
            <div
              className={`text-md font-normal mb-8 ${
                !price ? "text-gray-500" : "text-green-700"
              }`}
            >
              {price ? price : "Price"}
            </div>
            <div
              className={`text-md font-light text-left ${
                !description && "text-gray-500"
              }`}
            >
              {description ? description : "Description"}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return categoryQuery.loading ? (
    <Spinner />
  ) : (
    <CreateListingInternalComponent
      categories={categoryQuery.data.categories}
    />
  );
};
