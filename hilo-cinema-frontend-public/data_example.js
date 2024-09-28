// Example schedule data
export const exampleSchedule = [
    {
        day: '2024-06-27',
        detailSchedule: [
            {
                theater: "Galaxy Nguyễn Du",
                times: ["11:00", "15:15", "17:15", "20:15"]
        
            },
            {
                theater: "Galaxy Tân Bình",
                times: ["11:00", "15:15", "17:15", "20:15"]
            },
            {
                theater: "Galaxy Sala",
                times: ["11:00", "15:15", "17:15", "20:15"]
            }
        ]
    },
    {
        day: '2024-06-28',
        detailSchedule: [
            {
                theater: "Galaxy Tân Bình",
                times: ["11:00", "15:15", "17:15", "20:15"]
            },
            {
                theater: "Galaxy Sala",
                times: ["11:00", "15:15", "17:15", "20:15"]
            }
        ]
    },
];

export const exampleMovie = {
    id: '1',
    title: 'Inception',
    releaseDate: '2010-07-16',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    duration: 148,
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page', 'Tom Hardy'],
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
    rating: 8.8,
    posterUrl: 'https://example.com/poster/inception.jpg',
    trailerUrl: 'https://example.com/trailer/inception.mp4',
    url: 'ke-cap-mat-trang-4',
};

export const exampleFilterList = [
    {
        FilterName: "Thể loại",
        FilterValue: [{
            id: 1,
            name: 'Leanne Graham'
        },
        {
            id: 2,
            name: 'Ervin Howell'
        }]
    },
    {
        FilterName: "Thể loại",
        FilterValue: [{
            id: 1,
            name: 'Leanne Graham'
        },
        {
            id: 2,
            name: 'Ervin Howell'
        }]
    },
    {
        FilterName: "Thể loại",
        FilterValue: [{
            id: 1,
            name: 'Leanne Graham'
        },
        {
            id: 2,
            name: 'Ervin Howell'
        }]
    }
]


export const exampleOption = [
    {
        id: 1,
        name: 'Leanne Graham'
    },
    {
        id: 2,
        name: 'Ervin Howell'
    }
]

export const exampleCinemaSeat = {
    id: 1,
    cinemaName: 'Galaxy Phú Thọ',
    room: 3,
    row: 4,
    col: 5,
    seats: [
        {
            row: 'A',
            col: 1,
            status: 'available',
            type: 'Normal',
            name: 'A1'
        },
        {
            row: 'A',
            col: 2,
            status: 'disavailable',
            type: 'Normal',
            name: 'A2'
        },
        {
            row: 'A',
            col: 3,
            status: 'invisible',
            type: 'Normal',
            name: ''
        },
        {
            row: 'A',
            col: 4,
            status: 'available',
            type: 'Normal',
            name: 'A3'
        },
        {
            row: 'A',
            col: 5,
            status: 'available',
            type: 'Normal',
            name: 'A4'
        },
        {
            row: 'B',
            col: 1,
            status: 'available',
            type: 'Normal',
            name: 'B1'
        },
        {
            row: 'B',
            col: 2,
            status: 'available',
            type: 'Normal',
            name: 'B2'
        },
        {
            row: 'B',
            col: 3,
            status: 'disavailable',
            type: 'Normal',
            name: 'B3'
        },
        {
            row: 'B',
            col: 4,
            status: 'available',
            type: 'Normal',
            name: 'B4'
        },
        {
            row: 'C',
            col: 1,
            status: 'invisible',
            type: 'Normal',
            name: ''
        },
        {
            row: 'C',
            col: 2,
            status: 'available',
            type: 'Normal',
            name: 'C1'
        },
        {
            row: 'C',
            col: 3,
            status: 'available',
            type: 'Normal',
            name: 'C2'
        },
        {
            row: 'C',
            col: 4,
            status: 'available',
            type: 'Normal',
            name: 'C3'
        },
        {
            row: 'C',
            col: 5,
            status: 'invisible',
            type: 'Normal',
            name: ''
        },
        {
            row: 'D',
            col: 1,
            status: 'disavailable',
            type: 'Normal',
            name: 'D1'
        },
        {
            row: 'D',
            col: 2,
            status: 'available',
            type: 'Normal',
            name: 'D2'
        },
        {
            row: 'D',
            col: 3,
            status: 'available',
            type: 'Normal',
            name: 'D3'
        },
        {
            row: 'D',
            col: 4,
            status: 'invisible',
            type: 'Normal',
            name: ''
        },
        {
            row: 'D',
            col: 5,
            status: 'available',
            type: 'Normal',
            name: 'D4'
        }
    ]
}



export const bookingExample = {
    title: "Kẻ Trộm Mặt Trăng 4",      
    type: "2D Lồng Tiếng",
    theater: "Galaxy Nguyễn Du",
    room: "RAP 2",
    time: "10:45",

    
    total: 0,          
};
