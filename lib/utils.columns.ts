import { differenceInMilliseconds, format } from 'date-fns';

export const isAvaibleTimeToSendMessage = (
  dateSend: string,
  recived?: boolean
) => {
  if (recived) return false;
  if (!dateSend) {
    console.log(dateSend);
    return true;
  }
  console.log(dateSend);
  const sendDate = new Date(dateSend);
  const now = new Date();
  const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

  // Calculate the difference in milliseconds
  const timeDifference = differenceInMilliseconds(now, sendDate);

  // Check if the difference is greater than 12 hours
  if (timeDifference > twelveHoursInMilliseconds) {
    console.log(format(sendDate, 'dd-MM-yyyy hh:mm a'));
    return true;
  }
};
