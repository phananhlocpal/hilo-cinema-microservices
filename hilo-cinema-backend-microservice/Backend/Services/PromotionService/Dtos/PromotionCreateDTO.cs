﻿using System.ComponentModel.DataAnnotations;

namespace PromotionService.Dtos
{
    public class PromotionCreateDTO
    {
        [Key, Required]
        public int Id { get; set; }
        public string Description { get; set; }
        public int Value { get; set; }
        public DateTime Start_Date { get; set; }
        public DateTime Due_Date { get; set; }
        public string Status { get; set; }
    }
}