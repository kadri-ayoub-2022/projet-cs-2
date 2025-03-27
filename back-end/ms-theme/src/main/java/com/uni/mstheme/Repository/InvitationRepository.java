package com.uni.mstheme.Repository;

import com.uni.mstheme.Entities.Invitation;
import com.uni.mstheme.Entities.ProjectTheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface InvitationRepository extends JpaRepository<Invitation,Long> {
    @Transactional
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM Invitation i WHERE (i.student1Id = :student1Id AND i.student2Id = :student2Id) OR (i.student1Id = :student2Id AND i.student2Id = :student1Id)")
    void deleteByStudentIds(@Param("student1Id") Long student1Id, @Param("student2Id") Long student2Id);

    List<Invitation> findByProjectTheme_ThemeId(Long themeId);

    long countByProjectTheme_ThemeId(Long themeId);
}
