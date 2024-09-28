import { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Modal, Box, TextField, List, ListItem, ListItemText, Typography } from '@mui/material';

// Custom styles for the scrollable list
const ScrollableList = styled(List)({
    maxHeight: '400px', // Fixed height to ensure stable size
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#555',
    },
});

// Utility function to truncate the description
const truncateText = (text, maxWords) => {
    const words = text.split(' ');
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
};

const MovieSearch = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [allMovies, setAllMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);

    useEffect(() => {
        // Fetch all movies when the component mounts
        const fetchMovies = async () => {
            try {
                const response = await axios.get('http://localhost:8000/MovieService');
                setAllMovies(response.data);
                setFilteredMovies(response.data);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, []);

    useEffect(() => {
        // Filter movies based on the search query
        if (query.trim() === '') {
            setFilteredMovies(allMovies);
        } else {
            const lowercasedQuery = query.toLowerCase();
            const filtered = allMovies.filter(movie =>
                movie.title.toLowerCase().includes(lowercasedQuery)
            );
            setFilteredMovies(filtered);
        }
    }, [query, allMovies]);

    const handleSearchChange = (event) => {
        setQuery(event.target.value);
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="movie-search-modal-title"
            aria-describedby="movie-search-modal-description"
            disableAutoFocus
        >
            <Box sx={{
                width: '600px',
                height: '80vh', 
                maxHeight: '80vh',
                bgcolor: 'background.paper',
                p: 4,
                borderRadius: 2,
                boxShadow: 24,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}>
                <Typography variant="h6" id="movie-search-modal-title">
                    Tìm kiếm phim
                </Typography>
                <TextField
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    placeholder="Tìm kiếm phim..."
                    value={query}
                    onChange={handleSearchChange}
                />
                {filteredMovies.length > 0 && (
                    <ScrollableList component="nav">
                        {filteredMovies.map(movie => (
                            <ListItem key={movie.id} alignItems="flex-start">
                                <img
                                    src={`data:image/jpeg;base64,${movie.imgSmall}`}
                                    alt={movie.title}
                                    style={{
                                        width: '100px', 
                                        height: '150px', 
                                        objectFit: 'cover', 
                                        borderRadius: '10px',
                                        marginRight: '16px',
                                    }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <ListItemText
                                        primary={<a href={`/chon-phim/${movie.movieUrl}`} style={{ textDecoration: 'none', color: '#1976d2', fontSize: '1.5rem' }}>{movie.title}</a>}
                                    />
                                    <Typography variant="body2" color="textSecondary" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                        {truncateText(movie.description, 30)}
                                    </Typography>
                                </div>
                            </ListItem>
                        ))}
                    </ScrollableList>
                )}
            </Box>
        </Modal>
    );
};

export default MovieSearch;
