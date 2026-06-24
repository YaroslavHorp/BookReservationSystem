package com.library.system.entity;

import jakarta.persistence.*;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "borrowed_books")
public class BorrowedBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    @Setter
    private User user;

    @ManyToOne
    @JoinColumn(name="book_id", nullable = false)
    @Setter
    private Book book;

    private LocalDate rentDate;
    private LocalDate dueDate;

    public BorrowedBook() {}

    public BorrowedBook(User user, Book book, LocalDate rentDate, LocalDate dueDate) {
        this.user = user;
        this.book = book;
        this.rentDate = rentDate;
        this.dueDate = dueDate;
    }

    //Getters
    public Long getId() { return Id; }
    public User getUser() { return user; }
    public Book getBook() { return book; }
    public LocalDate getRentDate() { return rentDate; }
    public LocalDate getDueDate() { return dueDate; }
}
