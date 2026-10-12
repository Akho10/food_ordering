package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;

@CrossOrigin(origins="http://localhost:4200")
@RestController
@RequestMapping ("api/products")
public class ProductController {

	@Autowired
	private ProductService productService;

	// getAll
	@GetMapping("/list")
	public List<Product> getAllProducts() {
		return productService.getAllProducts();
	}

	// findById
	@GetMapping("/list/{id}")
	public Product findProductById(@PathVariable Long id) {
		return productService.findProductById(id);
	}

	// add
	@PostMapping("/add")
	public Product addProduct(@RequestBody Product product) {
		return productService.addProduct(product);
	}

	// update
	@PutMapping("/edit/{id}")
	public void updateProduct(@PathVariable Long id,@RequestBody Product product) {
//		Product prod = findProductById(id);
		productService.updateProduct(id, product);
	}

	// delete
	@DeleteMapping ("/delete/{id}")
	public void deleteProductById(@PathVariable Long id) {
		productService.deleteProductById(id);
	}

	// search
	@GetMapping("/search/{keyword}")
	public List<Product> searchProductsByKeyword(@PathVariable String keyword) {
		return productService.searchProductsByKeyword(keyword);
	}
}
