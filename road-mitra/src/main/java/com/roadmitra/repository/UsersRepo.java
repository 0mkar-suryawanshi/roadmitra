package com.roadmitra.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.roadmitra.entity.Users;

@Repository
public interface UsersRepo extends JpaRepository<Users, String> {
    

    
}
