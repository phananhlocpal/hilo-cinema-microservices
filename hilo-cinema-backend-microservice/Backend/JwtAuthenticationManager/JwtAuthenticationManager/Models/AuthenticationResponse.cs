using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtAuthenticationManager.Models
{
    public class AuthenticationResponse
    {
        public object Account { get; set; }
        public string JwtToken { get; set; }
        public int ExpiresIn { get; set; }
    }
}
