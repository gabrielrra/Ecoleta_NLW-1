import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import './styles.css';

interface DropZoneProps {
  onFileUploaded: (file: File) => void;
}
interface TextsProps {
  isDragging: boolean;
}
const MyDropzone: React.FC<DropZoneProps> = ({ onFileUploaded }) => {
  const [fileUrl, setfileUrl] = useState('');
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setfileUrl(url);
      onFileUploaded(file);
    },
    [onFileUploaded]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div
      className={isDragActive ? 'dropzoneDragging' : 'dropzone'}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {fileUrl ? (
        <img src={fileUrl} alt="Imagem do estabelecimento" />
      ) : (
        <Texts isDragging={isDragActive} />
      )}
    </div>
  );
};
const Texts: React.FC<TextsProps> = ({ isDragging }) => {
  return isDragging ? (
    <p>Solte a imagem aqui ...</p>
  ) : (
    <p>
      <FiUpload />
      Araste e solte a imagem do estabelecimento ou clique aqui
    </p>
  );
};
export default MyDropzone;
