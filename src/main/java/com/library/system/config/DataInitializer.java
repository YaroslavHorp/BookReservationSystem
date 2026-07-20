package com.library.system.config;

import com.library.system.entity.Book;
import com.library.system.entity.User;
import com.library.system.repository.BookRepository;
import com.library.system.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private BookRepository bookRepository;
    private UserRepository userRepository;

    public DataInitializer(BookRepository bookRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (bookRepository.count() == 0) {
            System.out.println("Data base is empty. Adding new books...");

            bookRepository.save(new Book("Wiedźmin: Ostatnie życzenie", "Andrzej Sapkowski", "9788375780635", 20.0, 5));
            bookRepository.save(new Book("Hobbit, czyli tam i z powrotem", "J.R.R. Tolkien", "9788324404551", 15.0, 3));
            bookRepository.save(new Book("Mistrz i Małgorzata", "Michaił Bułhakow", "9788374958318", 12.0, 2));
            bookRepository.save(new Book("Clean Code (Czysty Kod)", "Robert C. Martin", "9788328302341", 8.0, 4));

            System.out.println("Added new books...");
        }

        if (userRepository.count() == 0) {
            System.out.println("Data base is empty. Adding new users...");

            userRepository.save(new User("Jan", "Kowalski", "jan.kowalski@email.com",200.0));
            userRepository.save(new User("Anna", "Nowak", "anna.nowak@email.com", 50.0));
            userRepository.save(new User("Jaroslaw", "Andrzejczyk", "jaroslaw.andrzejczyk@email.com", 100.0));
        }
    }
}
