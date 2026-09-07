package com.hirena.jobseeker.dto;

import com.hirena.jobseeker.entity.Skill;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillResponse {

    private Long id;
    private String name;

    public static SkillResponse fromEntity(Skill skill) {
        return SkillResponse.builder()
                .id(skill.getId())
                .name(skill.getName())
                .build();
    }
}
