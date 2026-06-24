package com.library.system.controller;

import com.library.system.entity.Book;
import com.library.system.entity.BorrowedBook;
import com.library.system.entity.User;
import com.library.system.repository.BookRepository;
import com.library.system.repository.BorrowedBookRepository;
import com.library.system.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rentals")
@CrossOrigin
public class RentalController {

    private final BorrowedBookRepository borrowedBookRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public RentalController(BorrowedBookRepository bbr, UserRepository ur, BookRepository br) {
        this.borrowedBookRepository = bbr;
        this.userRepository = ur;
        this.bookRepository = br;
    }

    @GetMapping("/user/{userId}")
    public List<BorrowedBook> getUserRentals(@PathVariable Long userId) {
        return borrowedBookRepository.findByUserId(userId);
    }

    @PostMapping("/borrow")
    public ResponseEntity<?> borrowBooks(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        List<Integer> bookIds = (List<Integer>) request.get("bookIds");

        User user = userRepository.findById(userId).orElseThrow();

        for (Integer bookId : bookIds) {
            Book book = bookRepository.findById(Long.valueOf(bookId)).orElseThrow();

            BorrowedBook rental = new BorrowedBook(user, book, LocalDate.now(), LocalDate.now().plusDays(14));
            borrowedBookRepository.save(rental);
        }

        return ResponseEntity.ok(Map.of("message", "Wypożyczono pomyślnie!"));
    }

}
