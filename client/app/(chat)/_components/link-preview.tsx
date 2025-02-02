import { useEffect, useState } from "react";
import axios from "axios";
import { ILInkLinkPreview } from "@/types";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const LinkPreview = ({ url }: { url: string }) => {
  const [preview, setPreview] = useState<ILInkLinkPreview>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!url) return;

    const fetchPreview = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `https:/iframe.ly/api/oembed?url=${encodeURIComponent(
            url
          )}&api_key=b73f64dbc1ce0e90e99322`
        );
        console.log("API Response:", data); // Debugging
        setPreview(data);
      } catch (error) {
        console.error("Error fetching preview", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

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
            {preview.thumbnail_url && (
              <img
                className="w-32 h-32 rounded bg-cover bg-center object-contain"
                src={preview.thumbnail_url}
                alt="preview"
              />
            )}
          </div>
        )
      )}
    </div>
  );
};

export default LinkPreview;
