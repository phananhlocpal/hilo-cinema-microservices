import { useState, useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Select, FormControl, FormLabel, Input } from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";
import { toBase64 } from "../../utils/toBase64";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Bold,
    Essentials,
    Heading,
    Indent,
    IndentBlock,
    Italic,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    Table,
    Undo,
    FontFamily,
    FontSize,
    FontColor,
    FontBackgroundColor,
    Strikethrough,
    Code,
    BlockQuote,
    CodeBlock,
    Alignment,
    TodoList,
    Image,
    ImageUpload,
    ImageInsertUI,
    ImageInsert,
    ImageToolbar,
    ImageResize,
    ImageStyle,
    Font,
    FontColorUI,
    FontFamilyUI,
    FontColorEditing,
    FontFamilyEditing,
} from 'ckeditor5';
import Base64UploadAdapter from "../../utils/CustomUploadAdapter";


import 'ckeditor5/ckeditor5.css';

const UpdateBlogModal = ({ blog, isOpen, onClose, fetchBlogs }) => {
    const [title, setTitle] = useState(blog.title);
    const [description, setDescription] = useState(blog.description);
    const [content, setContent] = useState(blog.content);
    const [type, setType] = useState(blog.type);
    const [img, setImage] = useState(blog.img);
    const [status, setStatus] = useState(blog.status);
    const employeeId = blog.employeeId; 
    const [imagePreview, setImagePreview] = useState(`data:image/jpeg;base64,${blog.img}`);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            console.log(reader.result)
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setImage(file);
        }
        else {
            setImagePreview(`data:image/jpeg;base64,${blog.img}`);
            setImage(blog.img);
        }
    };

    const onUpdate = async () => {
        const token = localStorage.getItem("jwtToken");

        const data = {
            id: blog.id,
            title,
            description,
            content: content,
            type,
            img: img!=blog.img ? await toBase64(img) : blog.img, 
            status,
            createdDate: blog.created,
            employeeId:0,
        };

        try {
            await axios.put(`http://localhost:8000/BlogService/${blog.id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Site: 'admin',
                    Role: 'admin'
                },
            });
            onClose();
            fetchBlogs(); 
        } catch (error) {
            console.error("Error updating blog:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update Blog Post</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={2}>
                <FormControl>
                        <FormLabel>Title</FormLabel>
                        <Input
                            type="text"
                            className="border-2 border-gray-300 p-2 w-full"
                            name="title"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Title"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Type</FormLabel>
                        <Select
                            placeholder="Select Type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value='Bình luận phim'>Bình luận phim</option>
                            <option value='Tin mới'>Tin mới</option>
                            <option value='Diễn viên'>Diễn viên</option>
                            <option value='Ưu đãi'>Ưu đãi</option>
                            <option value='Phim hay tháng'>Phim hay tháng</option>
                            <option value='Thể lệ'>Thể lệ</option>
                            <option value='Chính sách'>Chính sách</option>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Image</FormLabel>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange} 
                        />
                        {imagePreview && (
                            <img src={imagePreview} alt="Image Preview" style={{ marginTop: '10px', maxHeight: '200px' }} />
                        )}
                    </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Input
                            type="text"
                            className="border-2 border-gray-300 p-2 w-full"
                            name="description"
                            id="description"
                            placeholder="(Optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Content</FormLabel>
                        <CKEditor
                            editor={ClassicEditor}
                            data={content}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setContent(data);
                            }}
                            config={{
                                extraPlugins: [MyCustomUploadAdapterPlugin],
                                toolbar: {
                                    items: [
                                        'undo', 'redo',
                                        '|',
                                        'heading',
                                        '|',
                                        'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                                        '|',
                                        'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                                        '|',
                                        'link', 'uploadImage', 'blockQuote', 'codeBlock', 'mediaEmbed', 'insertTable',
                                        '|',
                                        'alignment',
                                        '|',
                                        'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                                    ],
                                    shouldNotGroupWhenFull: true
                                },
                                plugins: [
                                    Undo,
                                    Heading,
                                    FontFamily,
                                    FontSize,
                                    FontColor,
                                    FontBackgroundColor,
                                    Bold,
                                    Italic,
                                    Strikethrough,
                                    Code,
                                    Link,
                                    BlockQuote,
                                    CodeBlock,
                                    MediaEmbed,
                                    Alignment,
                                    TodoList,
                                    Indent,
                                    ImageUpload,
                                    ImageInsert,
                                    ImageInsertUI,
                                    ImageToolbar,
                                    Image,
                                    ImageResize,
                                    ImageStyle,
                                    Font,
                                    FontColorUI,
                                    FontFamilyEditing,
                                    FontFamilyUI,
                                    FontColorEditing,
                                ],
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Status</FormLabel>
                        <Select
                            id="status"
                            placeholder="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value='Active'>Active</option>
                            <option value='Inactive'>Inactive</option>
                        </Select>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onUpdate}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

UpdateBlogModal.propTypes = {
    blog: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchBlogs: PropTypes.func.isRequired,
};

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new Base64UploadAdapter(loader);
    };
}


export default UpdateBlogModal;