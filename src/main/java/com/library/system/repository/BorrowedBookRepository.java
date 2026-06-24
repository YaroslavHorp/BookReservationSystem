package com.library.system.repository;

import com.library.system.entity.BorrowedBook;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import java.util.List;

public interface BorrowedBookRepository extends JpaRepository<BorrowedBook, Long> {
    List<BorrowedBook> findByUserId(Long userId);
}
