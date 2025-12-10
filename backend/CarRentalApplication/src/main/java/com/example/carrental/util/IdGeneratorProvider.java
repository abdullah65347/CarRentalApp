package com.example.carrental.util;

import org.springframework.stereotype.Component;

@Component
public class IdGeneratorProvider {

     private static UniqueIdGenerator generator;

     public IdGeneratorProvider(UniqueIdGenerator generator) {
          IdGeneratorProvider.generator = generator;
     }

     public static UniqueIdGenerator getGenerator() {
          return generator;
     }
}
