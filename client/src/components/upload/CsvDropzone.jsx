import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { FileUp, Loader2 } from "lucide-react";

export default function CsvDropzone({ eventId, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("csv", file);
      formData.append("eventId", eventId);

      setUploading(true);
      setProgress(0);

      try {
        const { data } = await api.post("/participants/upload", formData, {
          onUploadProgress: (p) =>
            setProgress(Math.round((p.loaded * 100) / p.total)),
        });
        toast.success(`Upload complete! ${data.results.success} tickets sent.`);
        onSuccess?.(data.results);
      } catch (err) {
        toast.error(err.response?.data?.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [eventId, onSuccess],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative mt-3 sm:mt-4 border-2 border-dashed rounded-xl p-6 sm:p-8 transition-all cursor-pointer text-center ${isDragActive ? "border-white bg-white/20" : "border-indigo-300 hover:bg-white/10"}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-white">
        {uploading ? (
          <>
            <Loader2 className="animate-spin mb-2 h-6 w-6 sm:h-8 sm:w-8" />
            <p className="text-xs sm:text-sm font-semibold">
              Processing... {progress}%
            </p>
          </>
        ) : (
          <>
            <FileUp className="mb-2 h-6 w-6 sm:h-8 sm:w-8" />
            <p className="text-xs sm:text-sm font-semibold">
              Drop CSV here or click to upload
            </p>
          </>
        )}
      </div>
    </div>
  );
}
