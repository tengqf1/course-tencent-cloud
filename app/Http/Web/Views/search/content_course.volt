<div class="search-course-list">
    {% for item in pager.items %}
        {% set course_url = url({'for':'web.course.show','id':item.id}) %}
        <div class="search-course-card clearfix">
            <div class="cover">
                <a href="{{ course_url }}">
                    <img src="{{ item.cover }}!cover_270" alt="{{ item.title|e }}">
                </a>
            </div>
            <div class="info">
                <div class="title">
                    <a href="{{ course_url }}">{{ item.title }}</a>
                </div>
                <div class="summary">{{ item.summary }}</div>
                <div class="meta">
                    <span>分类：{{ item.category.name }}</span>
                    <span>讲师：{{ item.teacher.name }}</span>
                    <span>难度：{{ level_info(item.level) }}</span>
                    <span>课时：{{ item.lesson_count }}</span>
                    <span>学员：{{ item.user_count }}</span>
                </div>
            </div>
        </div>
    {% endfor %}
</div>
