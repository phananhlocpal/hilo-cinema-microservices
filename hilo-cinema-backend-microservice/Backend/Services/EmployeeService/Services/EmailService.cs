using EmployeeService.Models;
using System.Net;
using System.Net.Mail;

namespace EmployeeService.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task WelcomeEmail(Employee employee, string plainTextPassword)
        {
            var message = new MailMessage();
            message.From = new MailAddress(_configuration["Smtp:Username"]);
            message.To.Add(new MailAddress(employee.Email));
            message.Subject = "[HiloCinema] Welcome to our home!";
            message.Body = $@"
            <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;'>
                <div style='background-color: #4CAF50; padding: 20px; text-align: center; color: #fff;'>
                    <h1 style='margin: 0; font-size: 24px;'>Chào mừng bạn đến với gia đình Hilo Cinema</h1>
                </div>
                <div style='padding: 30px; background-color: #f7f7f7;'>
                    <p style='font-size: 18px; margin: 0 0 20px 0;'>Hi there,</p>
                    <p style='margin: 0 0 20px 0;'>Đây là tài khoản đăng nhập vào hệ thống của bạn: </p>
                    <p>Email: {employee.Email}</p>
                    <p>Email: {plainTextPassword}</p>
                    <p>Thanks,</p>
                    <p>Hilo Cinema Team</p>
                </div>
                <div style='background-color: #4CAF50; padding: 10px; text-align: center; color: #fff; font-size: 14px;'>
                    <p style='margin: 0;'>Need help? Contact our <a href='mailto:support@hilocinema.com' style='color: #fff; text-decoration: underline;'>support team</a>.</p>
                </div>
            </div>";
            message.IsBodyHtml = true;

            using (var smtp = new SmtpClient(_configuration["Smtp:Host"], int.Parse(_configuration["Smtp:Port"])))
            {
                smtp.Credentials = new NetworkCredential(_configuration["Smtp:Username"], _configuration["Smtp:Password"]);
                smtp.EnableSsl = true;
                await smtp.SendMailAsync(message);
            }
        }
    }
}
