package com.uni.mstheme.Repository;

import com.uni.mstheme.Entities.ProjectTheme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectThemeRepository extends JpaRepository<ProjectTheme,Long> {
    List<ProjectTheme> findByTeacherId(Long teacherId);

    List<ProjectTheme> findByStudent1IdIsNullAndStudent2IdIsNull();

    Optional<ProjectTheme> findByStudent1IdOrStudent2Id(Long student1Id, Long student2Id);

    List<ProjectTheme> findByProgression(double progression);

    long count();

    long countByStatusTrue();

    long countByStatusFalse();

    long countByProgression(double progression);

    long countByProgressionBetween(double start, double end);

    long countByStudent1IdIsNullAndStudent2IdIsNull();
}
