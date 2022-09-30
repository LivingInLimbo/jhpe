import { useState, useEffect, FormEvent } from "react";
import { useQuery, gql } from "@apollo/client";
import { optionsNoAuth } from "../..";
import { useErrorHandler } from "react-error-boundary";
import { Spinner } from "../app/Spinner";
import { LabledTextInput } from "../forms/LabledTextInput";
import { LabledSelect } from "../forms/LabledSelect";
import { ColorButton } from "../forms/ColorButton";
import { IoAdd } from "react-icons/io5";
import { ImageCarousel } from "./ImageCarousel";

export const CreateListingComponent = () => {
  const GET_CATEGORIES = gql`
    query getCategories {
      categories {
        id
        name
        urlName
        subcategory {
          id
          name
          urlName
        }
      }
    }
  `;

  type Category = {
    id: Number;
    name: String;
    urlName: String;
    subcategory: SubCategory[];
  };

  type SubCategory = {
    id: Number;
    name: String;
    urlName: String;
  };

  let subcategories: SubCategory[] = [];

  const categoryQuery = useQuery(GET_CATEGORIES);
  useErrorHandler(categoryQuery.error);
  if (categoryQuery.data) {
    console.log(categoryQuery.data);
    subcategories = categoryQuery.data.categories[0].subcategory;
  }

  const CreateListingInternalComponent = () => {
    const submitForm = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    };

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const onNameChange = (e: any) => {
      setTitle(e.target.value);
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
        console.log(parseInt(pureNumber));
        if (parseInt(pureNumber) != NaN) {
          let newValue = `$${parseInt(pureNumber).toLocaleString()}`;
          setPrice(newValue);
        }
      }
    };

    const onCategoryChange = (e: any) => {
      const value = parseInt(e.target.value);
      const selectedCategory = categoryQuery.data.categories.find(
        (category: Category) => category.id === value
      );
      if (selectedCategory) {
        subcategories = selectedCategory.subcategory;
      }
    };

    const [imgSrcs, setImgSrcs] = useState<string[]>([]);

    const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        console.log(e.target.files);
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

          const handleFileChosen = async (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
              let fileReader = new FileReader();
              fileReader.onload = () => {
                resolve(fileReader.result?.toString() || "");
              };
              fileReader.onerror = reject;
              fileReader.readAsDataURL(file);
            });
          };

          const results: string[] = await Promise.all(
            Array.from(e.target.files).map(async (file: File) => {
              const fileContents = await handleFileChosen(file);
              return fileContents;
            })
          );

          setImgSrcs(results);
        }
      }
    };

    const formFieldClass = "w-full mb-4";

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
            {imgSrcs.map((imgSrc: string) => (
              <img
                key={imgSrc}
                className="w-14 h-14 object-contain border rounded-md"
                src={imgSrc}
              ></img>
            ))}
          </div>

          <form className="w-full" onSubmit={submitForm}>
            <LabledTextInput
              className={formFieldClass}
              label="Title"
              placeholder="Title"
              onChange={onNameChange}
              value={title}
            />
            <LabledTextInput
              className={formFieldClass}
              label="Price"
              charLimit={12}
              placeholder="Price"
              onChange={onPriceChange}
              value={price}
            />
            <LabledTextInput
              className={formFieldClass}
              label="Description"
              placeholder="Description"
              onChange={onDescriptionChange}
              value={description}
            />
            <LabledSelect
              className={formFieldClass}
              onChange={onCategoryChange}
              list={categoryQuery.data.categories}
              nameId="name"
              valueId="id"
              label="Category"
            />
            <LabledSelect
              className={formFieldClass}
              list={subcategories}
              nameId="name"
              valueId="id"
              label="Sub Category"
            />
          </form>
        </div>
        <div className="flex flex-col w-full rounded-md">
          <div className="mb-4">
            <ImageCarousel
              imgSrcs={imgSrcs}
              defaultImage={
                <div className="flex w-full h-full justify-center items-center text-gray-400 text-3xl">
                  No Images
                </div>
              }
            />
          </div>
          <div className="p-4 border border-gray-300 rounded-md">
            <div
              className={`text-3xl font-medium text-left mb-1 ${
                !title && "text-gray-500"
              }`}
            >
              {title ? title : "Title"}
            </div>
            <div
              className={`text-md font-normal mb-4 ${
                !price && "text-gray-500"
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
    <CreateListingInternalComponent />
  );
};
