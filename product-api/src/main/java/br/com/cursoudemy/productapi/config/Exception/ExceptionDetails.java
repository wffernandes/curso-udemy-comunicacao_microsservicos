package br.com.cursoudemy.productapi.config.Exception;

import lombok.Data;

@Data
public class ExceptionDetails {

    private int status;
    private String message;
}
