package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;

@Service
public class ProductService {

	@Autowired
	private ProductRepository productRepository;
	
	//getAll
	public List<Product> getAllProducts(){
		return productRepository.findAll();
	}
	//findById
	public Product findProductById(Long id){
		return productRepository.findById(id).orElseThrow();
	}
	//add
	public Product addProduct(Product product){
		return productRepository.save(product);
	}
	//update
	public void updateProduct(Long id,Product product){
		Product prod = findProductById(id);
		prod.setName(product.getName());
		prod.setDescription(product.getDescription());
		prod.setPrice(product.getPrice());
		prod.setQuantity(product.getQuantity());
		productRepository.save(prod);
	}
	//delete
	public void deleteProductById(Long id){
		 productRepository.deleteById(id);
	}
	//search
	public List<Product> searchProductsByKeyword(String keyword){
		return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
	}
	
	//reduce quantity
	public void reduceQuantity(long id, int orderQuantity) {
		Product prod = findProductById(id);
		
		if(prod.getQuantity() <= 0) {
			throw new RuntimeException("Out of stock");
		}
		
		if(prod.getQuantity() < orderQuantity) {
			throw new RuntimeException("Not enough stock available");
		}
		
		prod.setQuantity(prod.getQuantity()-orderQuantity);
		productRepository.save(prod);
	}
	
}