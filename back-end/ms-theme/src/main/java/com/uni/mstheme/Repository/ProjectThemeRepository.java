package com.uni.mstheme.Repository;

import com.uni.mstheme.Entities.ProjectTheme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectThemeRepository extends JpaRepository<ProjectTheme,Long> {
    List<ProjectTheme> findByTeacherId(Long teacherId);

    List<ProjectTheme> findByStudent1IdIsNullAndStudent2IdIsNull();
}
