import { circleAlertIcon } from '../../assets/icons';

function ValidationMessage({ message }) {
  return (
    <>
      <p className="text-red-500 text-[12px] flex items-center mt-0.5 ml-1">
        <img className="mr-1 w-4 h-4" src={circleAlertIcon} alt="Circle Alert" />
        {message}
      </p>
    </>
  )
}

export default ValidationMessage;
