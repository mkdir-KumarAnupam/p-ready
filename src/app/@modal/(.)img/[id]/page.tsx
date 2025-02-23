
import { getImage } from "~/server/queries";
import { Modal } from "./modal";
import FullPageImageView from "~/app/GlobalComponents/full-page-image";
export default function PhotoModal({
  params: {id: photoId},
}: {
  params: {id: string}
}) {
  const imageId = parseInt(photoId);

  return (
    <Modal>
        <FullPageImageView id={imageId} />
    </Modal>
  );
}