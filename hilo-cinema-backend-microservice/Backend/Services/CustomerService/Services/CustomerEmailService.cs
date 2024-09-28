using System.Net.Mail;
using System.Net;
using CustomerService.Models;

namespace CustomerService.Services
{
    public class CustomerEmailService
    {
        private readonly IConfiguration _configuration;
        public CustomerEmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task WelcomeEmail(Customer customer)
        {
            var message = new MailMessage
            {
                From = new MailAddress(_configuration["Smtp:Username"]),
                Subject = "Quý khách đã đăng ký thành công thành viên Hilo",
                IsBodyHtml = true
            };

            message.To.Add(new MailAddress(customer.Email));

            // Đính kèm hình ảnh
            var logoPath = "wwwroot/logo/logo1_white";
            var logoAttachment = new Attachment(logoPath);
            var logoContentId = "logo";
            logoAttachment.ContentId = logoContentId;
            message.Attachments.Add(logoAttachment);

            message.Body = $@"
            <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;'>
                <div style='background-color: rgb(3, 78, 162); padding: 20px; text-align: center; color: #fff;'>
                    <h1 style='margin: 0; font-size: 24px;'>Chào mừng quý khách đến với gia đình Hilo Cinema</h1>
                    <img src='cid:{logoContentId}' alt='Hilo Cinema Logo' style='width: 100px;'>
                </div>
                <div style='padding: 30px; background-color: #f7f7f7;'>
                    <p style='font-size: 18px; margin: 0 0 20px 0;'>Hi there,</p>
                    <p style='margin: 0 0 20px 0;'>Đây là tài khoản đăng nhập vào hệ thống của quý khách: </p>
                    <p>Email: {customer.Email}</p>
                    <p>Password: {customer.Password}</p>
                    <p>Thanks,</p>
                    <p>Đội ngũ Hilo Cinema </p>
                </div>
                <div style='background-color: rgb(3, 78, 162); padding: 10px; text-align: center; color: #fff; font-size: 14px;'>
                    <p style='margin: 0;'>Need help? Contact our <a href='mailto:support@hilocinema.com' style='color: #fff; text-decoration: underline;'>support team</a>.</p>
                </div>
            </div>";

            using (var smtp = new SmtpClient(_configuration["Smtp:Host"], int.Parse(_configuration["Smtp:Port"])))
            {
                smtp.Credentials = new NetworkCredential(_configuration["Smtp:Username"], _configuration["Smtp:Password"]);
                smtp.EnableSsl = true;
                await smtp.SendMailAsync(message);
            }
        }
    }
}
