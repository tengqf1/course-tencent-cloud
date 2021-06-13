<?php
/**
 * @copyright Copyright (c) 2021 深圳市酷瓜软件有限公司
 * @license https://opensource.org/licenses/GPL-2.0
 * @link https://www.koogua.com
 */

namespace App\Caches;

use App\Repos\Question as QuestionRepo;

class Question extends Cache
{

    protected $lifetime = 1 * 86400;

    public function getLifetime()
    {
        return $this->lifetime;
    }

    public function getKey($id = null)
    {
        return "question:{$id}";
    }

    public function getContent($id = null)
    {
        $questionRepo = new QuestionRepo();

        $question = $questionRepo->findById($id);

        return $question ?: null;
    }

}
