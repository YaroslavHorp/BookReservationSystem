package com.library.system.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter @Setter
    private Long id;

    private String firstName;
    private String lastName;
    private String email;

    @Getter
    @Setter
    private Double accountBalance = 20.0;

    public User(String firstName, String lastName, String email, Double accountBalance) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.accountBalance = accountBalance;
    }

}
