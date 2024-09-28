using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtAuthenticationManager.Models
{
    public class AuthenticationRequest
    {   
        public string Email { get; set; }
        public string Password { get; set; }
        public string Site { get; set; }
    }
}
