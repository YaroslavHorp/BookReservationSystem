package com.library.system.controller;

import com.library.system.entity.Book;
import com.library.system.entity.BorrowedBook;
import com.library.system.entity.User;
import com.library.system.repository.BookRepository;
import com.library.system.repository.BorrowedBookRepository;
import com.library.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rentals")
@CrossOrigin
public class RentalController {
    @Autowired
    private BorrowedBookRepository borrowedBookRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;


    @GetMapping("/user/{userId}")
    public List<BorrowedBook> getUserRentals(@PathVariable Long userId) {
        return borrowedBookRepository.findByUserId(userId);
    }

    @PostMapping("/borrow")
    @Transactional
    public ResponseEntity<?> borrowBooks(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());

            @SuppressWarnings("unchecked")
            List<Integer> bookIdsIntegers = (List<Integer>) request.get("bookIds");
            List<Long> bookIds = bookIdsIntegers.stream()
                    .map(Long::valueOf)
                    .toList();

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Book> booksToBorrow = bookRepository.findAllById(bookIds);

            double totalCartPrice = booksToBorrow.stream()
                    .mapToDouble(Book::getPrice)
                    .sum();

            if (user.getAccountBalance() < totalCartPrice) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "You are not enough balance"));
            }

            user.setAccountBalance(user.getAccountBalance() - totalCartPrice);
            userRepository.save(user);

            for (Book book : booksToBorrow) {
                BorrowedBook rental = new BorrowedBook();
                rental.setBook(book);
                rental.setUser(user);
                rental.setRentDate(LocalDate.now());
                rental.setDueDate(LocalDate.now().plusDays(14));
                borrowedBookRepository.save(rental);

            }

            return ResponseEntity.ok(java.util.Map.of(
                    "message", "rental successfully!",
                    "newBalance", user.getAccountBalance()
            ));
        }catch (Exception e){
            return ResponseEntity.internalServerError()
                    .body(java.util.Map.of("message", "Server error: " + e.getMessage()));
        }
    }

}
