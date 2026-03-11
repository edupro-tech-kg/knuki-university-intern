import Button from "./UI/Button";

function ManagementCard({
  id,
  name,
  post,
  onOpenModal,
  btnText,  
  showButton,
  image,
}) {
  return (
    <div className="flex-shrink-0 w-full flex flex-col rounded-lg bg-white p-3">
      <div className="w-full aspect-[5/7] bg-gray-100 rounded-md mb-4 flex items-center justify-center overflow-hidden">
        <img src={image} alt={name} />
      </div>

      <div className="flex flex-col flex-1 text-center">
        <p className="font-bold text-base text-gray-800">
          {name || "Имя не указано"}
        </p>

        <p className="text-gray-600 text-sm mb-2">
          {post || "Должность не указана"}
        </p>

        {showButton && (
          <Button
            variant="secondary"
            onClick={() => onOpenModal(id)}
            className="w-full"
          >
            {btnText || "Подробнее"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ManagementCard;