import { useEffect, useState } from "react";
import axios from "axios";
import { ILInkLinkPreview } from "@/types";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const LinkPreview = ({ url }: { url: string }) => {
  const [preview, setPreview] = useState<ILInkLinkPreview>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `https://api.linkpreview.net/?key=9c613223118ba8fcca95e605fbe81480&q=${encodeURIComponent(
            url
          )}`
        );
        setPreview(data);
      } catch (error) {
        console.error("Error fetching preview", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreview();
  }, []);

  return (
    <div className="max-w-96">
      <Link href={url} target="_blank" className="text-blue-700 underline">
        {url}
      </Link>
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-32">
          <Loader2 className="animate-spin text-xl w-10 h-10" />
        </div>
      ) : (
        preview && (
          <div
            onClick={() => window.open(url, "_blank")}
            className="flex mt-5 bg-blue-300/50 p-2 rounded backdrop-blur-md cursor-pointer"
          >
            <div>
              <h3 className="text-base mb-3">{preview.title}</h3>
              <p>{preview.description}</p>
            </div>
            {preview.image && (
              <img className="w-32 h-32" src={preview.image} alt="preview" />
            )}
          </div>
        )
      )}
    </div>
  );
};

export default LinkPreview;
