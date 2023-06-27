import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '@/components/Dashboard/Sidebar';
import Navbar from '@/components/Dashboard/Navbar';
import Tables from '@/components/Dashboard/Table';
import Table from '@/components/Tables/TablesBook';
import Borrow from '@/components/Tables/TablesBorrow';

export default function Authenticated({ user }) {
    const [userData, setUserData] = useState([]);
    const [dataBook, setDataBook] = useState([]);
    const [dataCategory, setDataCategory] = useState([]);
    const [dataAuthor, setDataAuthor] = useState([]);
    const [BorrowData, setBorrowData] = useState([]);

    useEffect(() => {
        axios
            .get('/api/User')
            .then((res) => {
                const filteredUsers = res.data.user.filter((user) => user.role === 'member');
                setUserData(filteredUsers);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        axios.get('/api/Book')
            .then((res) => {
                setDataBook(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    useEffect(() => {
        axios.get('/api/Category')
            .then((res) => {
                setDataCategory(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    useEffect(() => {
        axios.get('/api/Author')
            .then((res) => {
                setDataAuthor(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    useEffect(() => {
        axios.get('/api/Borrow')
            .then((res) => {
                setBorrowData(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    console.log(dataBook, dataCategory, dataAuthor, BorrowData);

    return (
        <div className="min-h-screen pt-3" style={{ background: 'linear-gradient(to bottom, rgba(0, 0, 255, 0.4) 35%, rgba(128, 128, 128, 0.1) 35%)' }}>
            <div className="flex flex-row">
                <Sidebar />
                <div className="flex flex-col w-full border-opacity-50">
                    <div className="grid mt-2 pr-5"><Navbar user={user} /></div>
                    <div className="flex">
                        <div className="mt-5 pr-5 w-full">
                            <Tables
                                title="Member Table"
                                columns={[
                                    'Name',
                                    'Role',
                                    'Phone',
                                    'Action']}
                                rows={userData.map((user) => ({
                                    name: user.name,
                                    email: user.email,
                                    role: user.role,
                                    phone: user.phone,
                                    action: 'action'
                                }))}
                            />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mt-5 pr-5 w-full">
                            <Table
                                title="Book Table"
                                columns={[
                                    'Title',
                                    'Author',
                                    'Stock',
                                    'Year',
                                    'Action']}
                                rows={dataBook.books ? dataBook.books.map((book) => (
                                    {
                                        title: book.title,
                                        category: book.category_id ? dataCategory.categories ? dataCategory.categories.map((category) => {
                                            if (category.id == book.category_id) {
                                                return category.title;
                                            }
                                        }) : [] : [],
                                        author: book.author_id ? dataAuthor.authors ? dataAuthor.authors.map((author) => {
                                            if (author.id == book.author_id) {
                                                return author.name;
                                            }
                                        }) : [] : [],
                                        stock: book.stock,
                                        year: book.year,
                                        action: 'action'
                                    })
                                ) : []}
                            />
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mt-5 pr-5 w-full">
                            <Borrow
                                title="Borrow Table"
                                columns={[
                                    'Member',
                                    'Status',
                                    'Borrow Date',
                                    'Return Date',
                                    'Penalty',
                                    'Action']}
                                rows={BorrowData.borrows ? BorrowData.borrows.map((borrow) => (
                                    {
                                        member: borrow.user_id ? userData.users ? userData.users.map((user) => {
                                            if (user.id == borrow.user_id) {
                                                return user.name;
                                            }
                                        }) : [] : [],
                                        book: borrow.book_id ? dataBook.books ? dataBook.books.map((book) => {
                                            if (book.id == borrow.book_id) {
                                                return book.title;
                                            }
                                        }) : [] : [],
                                        status: borrow.status,
                                        borrow: borrow.borrow_date,
                                        return: borrow.return_date,
                                        penalty: borrow.penalty,
                                        action: 'action'
                                    })
                                ) : []}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
