import emailjs from '@emailjs/browser';

interface EmailParams {
  email: string;
  to_email: string;
  rank: string;
  points_change: number;
  current_points: number;
}

export const useEmailNotification = () => {
  const sendPointsUpdateEmail = async (params: EmailParams) => {
    try {
      // const templateParams = {
      //   email: params.email,
      //   to_email: params.to_email,
      //   current_points: params.current_points,
      //   rank: params.rank,
      //   points_change: params.points_change,
      // };

      const templateParams = {
        email: 'kai@oceanheart.ai',
        to_email: params.email,
        current_points: params.current_points,
        rank: params.rank,
        points_change: params.points_change,
      };

      console.log(templateParams);

      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      console.log(result);

      return { status: 'success', data: result };
    } catch (error) {
      console.error('Error sending email:', error);
      return { status: 'error', error };
    }
  };

  return { sendPointsUpdateEmail };
}; 