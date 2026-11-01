package com.calorie.tracker.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Cấu trúc dữ liệu phân trang chuẩn")
public class PageResponse<T> {

    @Schema(description = "Danh sách phần tử trong trang hiện tại")
    private List<T> content;

    @Schema(description = "Số thứ tự trang (0-indexed)", example = "0")
    private int pageNumber;

    @Schema(description = "Kích thước phần tử trên một trang", example = "10")
    private int pageSize;

    @Schema(description = "Tổng số lượng phần tử tìm thấy", example = "42")
    private long totalElements;

    @Schema(description = "Tổng số trang", example = "5")
    private int totalPages;

    @Schema(description = "Có phải trang cuối cùng hay không", example = "false")
    private boolean last;

    public static <T> PageResponse<T> of(Page<T> page) {
        return PageResponse.<T>builder()
                .content(page.getContent())
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
