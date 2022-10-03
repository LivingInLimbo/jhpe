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
import Compressor from "compressorjs";

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
    subcategories = categoryQuery.data.categories[0].subcategory;
  }

  const CreateListingInternalComponent = ({
    categories,
  }: {
    categories: Category[];
  }) => {
    const submitForm = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    };

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState(categories[0].name);
    const [subCategory, setSubCategory] = useState(
      categories[0].subcategory[0].name
    );

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
      const selectedCategory = categories.find(
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

          const results: Blob[] = await Promise.all(
            Array.from(e.target.files).map(async (file: File) => {
              const fileContents = await handleFileChosen(file);
              return fileContents;
            })
          );

          const imageUrls = results.map((result) =>
            URL.createObjectURL(result)
          );

          setImgSrcs(imageUrls);

          //setImgSrcs(results);
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
              className={formFieldClass}
              onChange={onCategoryChange}
              list={categories}
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
        <div className="flex flex-col w-full lg:flex-row p-4 border-t md:border-l md:border-t-0 border-gray-400">
          <div className="lg:w-full mb-4">
            <ImageCarousel
              imgSrcs={imgSrcs}
              defaultImage={
                <div className="flex w-full h-full justify-center items-center text-gray-400 text-3xl">
                  No Images
                </div>
              }
            />
          </div>
          <div className="lg:w-[400px] p-8 ">
            <div className="font-light text-gray-500 mb-2">
              {category + " > " + subCategory}
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
