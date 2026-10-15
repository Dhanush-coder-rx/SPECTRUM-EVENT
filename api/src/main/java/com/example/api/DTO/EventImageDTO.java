package com.example.api.DTO;

public class EventImageDTO {
    private Long id;
    private String imageBase64;

    public EventImageDTO(Long id, String imageBase64) {
        this.id = id;
        this.imageBase64 = imageBase64;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImageBase64() {
        return imageBase64;
    }

    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }
}
