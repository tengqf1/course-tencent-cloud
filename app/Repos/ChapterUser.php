<?php

namespace App\Repos;

use App\Models\ChapterUser as ChapterUserModel;
use Phalcon\Mvc\Model;
use Phalcon\Mvc\Model\Resultset;
use Phalcon\Mvc\Model\ResultsetInterface;

class ChapterUser extends Repository
{

    /**
     * @param array $where
     * @return ResultsetInterface|Resultset|ChapterUserModel[]
     */
    public function findAll($where = [])
    {
        $query = ChapterUserModel::query();

        $query->where('1 = 1');

        if (!empty($where['course_id'])) {
            $query->andWhere('course_id = :course_id:', ['course_id' => $where['course_id']]);
        }

        if (!empty($where['chapter_id'])) {
            $query->andWhere('chapter_id = :chapter_id:', ['chapter_id' => $where['chapter_id']]);
        }

        if (!empty($where['user_id'])) {
            $query->andWhere('user_id = :user_id:', ['user_id' => $where['user_id']]);
        }

        return $query->execute();
    }

    /**
     * @param int $chapterId
     * @param int $userId
     * @return ChapterUserModel|Model|bool
     */
    public function findChapterUser($chapterId, $userId)
    {
        return ChapterUserModel::findFirst([
            'conditions' => 'chapter_id = ?1 AND user_id = ?2 AND deleted = 0',
            'bind' => [1 => $chapterId, 2 => $userId],
        ]);
    }

}