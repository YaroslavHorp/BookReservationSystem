package com.library.system.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "borrowed_books")
public class BorrowedBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long Id;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    @Setter
    @Getter
    private User user;

    @ManyToOne
    @JoinColumn(name="book_id", nullable = false)
    @Setter
    @Getter
    private Book book;

    @Getter
    private LocalDate rentDate;

    @Getter
    private LocalDate dueDate;

    public BorrowedBook() {}

    public BorrowedBook(User user, Book book, LocalDate rentDate, LocalDate dueDate) {
        this.user = user;
        this.book = book;
        this.rentDate = rentDate;
        this.dueDate = dueDate;
    }

}
